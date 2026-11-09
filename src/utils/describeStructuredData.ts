const EVENT_MICRODATA = /\bitemtype\s*=\s*["']https?:\/\/schema\.org\/(?:[A-Za-z]*Event|Festival)["']/gi;
const NEXT_DATA = /\bid\s*=\s*["']__NEXT_DATA__["']/i;
const NUXT_DATA = /\bid\s*=\s*["']__NUXT_DATA__["']|window\.__NUXT__/;
const MAX_TYPES = 4;

function readTypes(value: unknown, found: Set<string>): void {
  if (Array.isArray(value)) {
    for (const item of value) readTypes(item, found);
    return;
  }
  if (typeof value !== "object" || value === null) return;

  const record = value as Record<string, unknown>;
  const type = record["@type"];
  for (const name of Array.isArray(type) ? type : [type]) {
    if (typeof name === "string" && name.trim()) found.add(name.trim());
  }
  readTypes(record["@graph"], found);
}

/**
 * Resume que datos estructurados trae una pagina HTML (bloques JSON-LD y sus tipos, microdatos de
 * evento, framework). Sirve para explicar por que una fuente respondio pero no dio eventos.
 */
export function describeStructuredData(html: string, blocks: unknown[]): string {
  const parts: string[] = [];

  if (blocks.length === 0) {
    parts.push("sin bloques JSON-LD");
  } else {
    const types = new Set<string>();
    readTypes(blocks, types);
    const listed = [...types].slice(0, MAX_TYPES).join(", ");
    parts.push(`${blocks.length} ${blocks.length === 1 ? "bloque" : "bloques"} JSON-LD${listed ? ` de tipo ${listed}` : ""}`);
  }

  parts.push(`microdatos de evento: ${html.match(EVENT_MICRODATA)?.length ?? 0}`);
  if (NEXT_DATA.test(html)) parts.push("Next.js");
  if (NUXT_DATA.test(html)) parts.push("Nuxt");

  return parts.join(", ");
}
