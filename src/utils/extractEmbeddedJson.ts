/** Un JSON que la pagina lleva dentro de un `<script>`; `label` dice de donde salio (`__NEXT_DATA__`, `RSC`, el `id` del script...). */
export type EmbeddedJson = { label: string; value: unknown };

const SCRIPT = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
const JSON_SCRIPT_TYPE = /\btype\s*=\s*["']?application\/json\b/i;
const SCRIPT_ID = /\bid\s*=\s*["']?([^\s"'>]+)/i;
const FLIGHT_PUSH = /^\s*(?:self|window)\.__next_f\.push\(/;
/** Cada linea del flujo RSC de Next.js es `id:valor`; solo interesan las de JSON (`{` o `[`). */
const FLIGHT_ROW = /^[0-9a-zA-Z]+:([[{].*)$/;

const MAX_SCRIPT_CHARS = 6_000_000;
const MAX_VALUES = 24;
const NUXT_DATA_ID = "__NUXT_DATA__";

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

/** Un `self.__next_f.push([1, "texto"])` da un trozo del flujo; los demas tipos de trozo no traen datos. */
function readFlightChunk(body: string): string {
  const open = body.indexOf("(");
  const close = body.lastIndexOf(")");
  if (open < 0 || close <= open) return "";

  const chunk = parseJson(body.slice(open + 1, close));
  return Array.isArray(chunk) && chunk[0] === 1 && typeof chunk[1] === "string" ? chunk[1] : "";
}

function parseFlight(chunks: string[]): unknown[] {
  const rows: unknown[] = [];
  for (const line of chunks.join("").split("\n")) {
    const row = line.match(FLIGHT_ROW);
    const value = row ? parseJson(row[1]) : undefined;
    if (value !== undefined) rows.push(value);
  }
  return rows;
}

/**
 * Nuxt 3 guarda los datos "aplanados" (devalue): un arreglo donde los objetos y listas apuntan a otras
 * posiciones por numero. Esto lo arma de nuevo como objetos normales.
 */
function reviveNuxtData(flat: unknown[]): unknown {
  const cache = new Map<number, unknown>();

  const hydrate = (index: number): unknown => {
    if (index < 0) return undefined; // -1 undefined, -2 NaN, -3 Infinity...
    if (cache.has(index)) return cache.get(index);

    const value = flat[index];
    if (typeof value !== "object" || value === null) return value;

    if (Array.isArray(value)) {
      if (typeof value[0] === "string") {
        // Tipos especiales: ["Reactive", i] apunta al valor; ["Date", "..."] ya trae el valor.
        const [tag, inner] = value;
        if (tag === "Date") return inner;
        return typeof inner === "number" ? hydrate(inner) : undefined;
      }
      const list: unknown[] = [];
      cache.set(index, list);
      for (const item of value) list.push(typeof item === "number" ? hydrate(item) : item);
      return list;
    }

    const record: Record<string, unknown> = {};
    cache.set(index, record);
    for (const [key, item] of Object.entries(value)) record[key] = typeof item === "number" ? hydrate(item) : item;
    return record;
  };

  return hydrate(0);
}

/**
 * JSON que las paginas modernas dejan dentro del HTML: `__NEXT_DATA__` de Next.js (Pages Router), el
 * flujo RSC del App Router, `__NUXT_DATA__` de Nuxt 3 y cualquier `<script type="application/json">`.
 * Los eventos de sitios armados con JavaScript suelen estar ahi aunque no tengan JSON-LD.
 * Lo que no sea JSON valido se ignora.
 */
export function extractEmbeddedJson(html: string): EmbeddedJson[] {
  const found: EmbeddedJson[] = [];
  const flightChunks: string[] = [];

  for (const match of html.matchAll(SCRIPT)) {
    const [, attrs, body] = match;
    if (body.length > MAX_SCRIPT_CHARS) continue;

    if (FLIGHT_PUSH.test(body)) {
      const chunk = readFlightChunk(body);
      if (chunk) flightChunks.push(chunk);
      continue;
    }
    if (!JSON_SCRIPT_TYPE.test(attrs)) continue;

    const value = parseJson(body.trim());
    if (value === undefined || found.length >= MAX_VALUES) continue;

    const label = attrs.match(SCRIPT_ID)?.[1] ?? "json";
    found.push({ label, value: label === NUXT_DATA_ID && Array.isArray(value) ? reviveNuxtData(value) : value });
  }

  if (flightChunks.length > 0) {
    const rows = parseFlight(flightChunks);
    if (rows.length > 0) found.push({ label: "RSC", value: rows });
  }
  return found;
}
