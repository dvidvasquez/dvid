import type { JsonLdNode } from "./collectJsonLdEvents";
import { parseSchemaDate } from "./parseSchemaDate";

type Json = Record<string, unknown>;
type Fields = Map<string, unknown>;

const MAX_DEPTH = 24;
const MAX_VISITED = 200_000;
const MAX_EVENTS = 500;
const MAX_TITLE_LENGTH = 300;
/** Un texto que es JSON (Drupal guarda asi las opciones de su calendario) se abre si no es enorme. */
const MIN_JSON_TEXT = 20;
const MAX_JSON_TEXT = 2_000_000;
const JSON_TEXT = /^\s*[[{]/;

// Nombres de campo ya normalizados (minusculas y sin guiones ni guiones bajos): `start_date`, `startDate` y `StartDate` son lo mismo.
const TITLE_KEYS = ["name", "title", "titulo", "nombre", "eventname", "nombreevento", "headline", "posttitle"];
const START_KEYS = [
  "startdate", "startsat", "startat", "startdatetime", "start", "fechainicio", "fechainicial", "fechadeinicio",
  "datestart", "eventdate", "fechaevento", "initialdate", "begin",
];
/** Campos de fecha genericos: solo sirven si no hay uno mas especifico (una nota tambien tiene `date`). */
const WEAK_START_KEYS = ["date", "fecha", "datetime"];
const END_KEYS = ["enddate", "endsat", "endat", "enddatetime", "end", "fechafin", "fechafinal", "fechadefin", "dateend", "finaldate"];
const TIME_KEYS = ["hora", "time", "starttime", "horainicio"];
const DESCRIPTION_KEYS = ["description", "descripcion", "excerpt", "resumen", "summary"];
const IMAGE_KEYS = ["image", "imageurl", "imagen", "img", "cover", "poster", "thumbnail", "picture", "foto", "banner", "featuredimage"];
const URL_KEYS = ["url", "link", "href", "permalink", "uri"];
const LOCATION_KEYS = ["location", "venue", "lugar", "place", "sede", "address", "direccion"];
const CITY_KEYS = ["city", "ciudad", "municipio", "addresslocality"];
const STREET_KEYS = ["address", "direccion", "streetaddress"];
const PRICE_KEYS = ["price", "precio", "valor", "minprice", "lowprice"];
const CURRENCY_KEYS = ["currency", "pricecurrency", "moneda"];
const FREE_KEYS = ["isfree", "free", "gratis", "esgratis", "isaccessibleforfree"];
/** Dentro de un objeto de imagen (`{ url }`, `{ src }`, WordPress, Strapi...). */
const IMAGE_URL_KEYS = ["url", "src", "original", "full", "large", "medium", "sourceurl", "data", "attributes"];

const CLOCK = /^(\d{1,2}):(\d{2})(?::\d{2})?\s*(?:([ap])\.?\s*m\.?)?$/i;
const COLOMBIAN_PESO = "COP";

function isRecord(value: unknown): value is Json {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function toFields(record: Json): Fields {
  const fields: Fields = new Map();
  for (const [key, value] of Object.entries(record)) {
    const name = normalizeKey(key);
    if (!fields.has(name)) fields.set(name, value);
  }
  return fields;
}

/** Texto de un valor: una cadena, un numero o un objeto de WordPress (`{ rendered }`) o de idiomas (`{ es }`). */
function readText(value: unknown, depth = 0): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (!isRecord(value) || depth > 2) return "";
  return readText(value.rendered ?? value.es ?? value.text ?? value.value, depth + 1);
}

function firstText(fields: Fields, keys: string[]): string {
  for (const key of keys) {
    const text = readText(fields.get(key));
    if (text) return text;
  }
  return "";
}

/** Fecha que entiende `parseSchemaDate`; un numero entre 2001 y 2096 se toma como fecha Unix (segundos o milisegundos). */
function readDate(value: unknown): string | null {
  if (typeof value === "number") {
    const ms = value >= 1e9 && value < 4e9 ? value * 1000 : value >= 1e12 && value < 4e12 ? value : NaN;
    return Number.isFinite(ms) ? new Date(ms).toISOString() : null;
  }
  if (typeof value !== "string") return null;
  const text = value.trim();
  return parseSchemaDate(text) ? text : null;
}

function firstDate(fields: Fields, keys: string[]): string | null {
  for (const key of keys) {
    const date = readDate(fields.get(key));
    if (date) return date;
  }
  return null;
}

/** `19:30`, `7:30 pm` o `7:30 p. m.` -> `19:30`. */
function readClock(fields: Fields): string | null {
  for (const key of TIME_KEYS) {
    const match = readText(fields.get(key)).match(CLOCK);
    if (!match) continue;

    const meridiem = match[3]?.toLowerCase();
    const hour = (Number(match[1]) % 12) + (meridiem === "p" ? 12 : 0);
    const clockHour = meridiem ? hour : Number(match[1]);
    if (clockHour < 24 && Number(match[2]) < 60) return `${String(clockHour).padStart(2, "0")}:${match[2]}`;
  }
  return null;
}

function readImage(value: unknown, depth = 0): string {
  if (typeof value === "string") return value.trim();
  if (depth > 3) return "";
  if (Array.isArray(value)) {
    for (const item of value) {
      const url = readImage(item, depth + 1);
      if (url) return url;
    }
    return "";
  }
  if (!isRecord(value)) return "";

  const fields = toFields(value);
  for (const key of IMAGE_URL_KEYS) {
    const url = readImage(fields.get(key), depth + 1);
    if (url) return url;
  }
  return "";
}

function readLocation(fields: Fields): unknown {
  for (const key of LOCATION_KEYS) {
    const value = fields.get(key);
    if (typeof value === "string" && value.trim()) return value.trim();
    if (!isRecord(value)) continue;

    const place = toFields(value);
    const name = firstText(place, TITLE_KEYS);
    const street = firstText(place, STREET_KEYS);
    if (name || street) return { name, address: { streetAddress: street, addressLocality: firstText(place, CITY_KEYS) } };
  }
  return undefined;
}

/**
 * El precio de estos sitios es en pesos colombianos; si el objeto dice otra moneda no se usa. Un
 * precio es un numero o un texto con numero (`50000`, `$50.000`).
 */
function readOffers(fields: Fields): { price: string; priceCurrency: string } | undefined {
  const currency = firstText(fields, CURRENCY_KEYS).toUpperCase();
  if (currency && currency !== COLOMBIAN_PESO) return undefined;

  const price = firstText(fields, PRICE_KEYS);
  return /\d/.test(price) ? { price, priceCurrency: COLOMBIAN_PESO } : undefined;
}

/**
 * Un objeto es un evento si tiene titulo y una fecha de inicio que se entiende. Se devuelve como
 * evento de schema.org (igual que el JSON-LD) para convertirlo con el mismo codigo.
 */
function toEventNode(record: Json): JsonLdNode | null {
  const fields = toFields(record);

  const name = firstText(fields, TITLE_KEYS);
  if (name.length < 2 || name.length > MAX_TITLE_LENGTH) return null;

  const start = firstDate(fields, START_KEYS) ?? firstDate(fields, WEAK_START_KEYS);
  if (!start) return null;

  const clock = readClock(fields);
  const dateOnly = parseSchemaDate(start)?.dateOnly === true;
  const node: JsonLdNode = { "@type": "Event", name, startDate: dateOnly && clock ? `${start}T${clock}` : start };

  const end = firstDate(fields, END_KEYS);
  if (end) node.endDate = end;

  const description = firstText(fields, DESCRIPTION_KEYS);
  if (description) node.description = description;

  const image = IMAGE_KEYS.map((key) => readImage(fields.get(key))).find(Boolean);
  if (image) node.image = image;

  const url = firstText(fields, URL_KEYS);
  if (url) node.url = url;

  const location = readLocation(fields);
  if (location) node.location = location;

  const free = FREE_KEYS.some((key) => fields.get(key) === true);
  const offers = readOffers(fields);
  if (free) node.isAccessibleForFree = true;
  else if (offers) node.offers = offers;

  return node;
}

/**
 * Eventos dentro de JSON embebido en una pagina (`__NEXT_DATA__`, flujo RSC, Nuxt...), donde no hay
 * un formato fijo: se busca cualquier objeto con titulo (`title`, `name`, `titulo`...) y fecha de
 * inicio (`startDate`, `fecha_inicio`, `date`...) y se devuelve como evento de schema.org. Los
 * repetidos (mismo titulo y fecha) se cuentan una vez. Un texto que a su vez es JSON tambien se revisa.
 */
export function collectEmbeddedEvents(values: ReadonlyArray<unknown>): JsonLdNode[] {
  const found: JsonLdNode[] = [];
  const seen = new Set<string>();
  let visited = 0;

  const walk = (value: unknown, depth: number) => {
    if (depth > MAX_DEPTH || visited >= MAX_VISITED || found.length >= MAX_EVENTS) return;
    visited += 1;

    if (Array.isArray(value)) {
      for (const item of value) walk(item, depth + 1);
      return;
    }
    if (typeof value === "string") {
      if (value.length < MIN_JSON_TEXT || value.length > MAX_JSON_TEXT || !JSON_TEXT.test(value)) return;
      try {
        walk(JSON.parse(value), depth + 1);
      } catch {
        // No era JSON.
      }
      return;
    }
    if (!isRecord(value)) return;

    const node = toEventNode(value);
    const key = node ? `${node.name}|${node.startDate}` : "";
    if (node && !seen.has(key)) {
      seen.add(key);
      found.push(node);
    }
    // Se sigue adentro aunque este objeto sea un evento: una pagina puede traer su lista dentro.
    for (const child of Object.values(value)) walk(child, depth + 1);
  };

  for (const value of values) walk(value, 0);
  return found;
}
