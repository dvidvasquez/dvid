import type { EmbeddedJson } from "./extractEmbeddedJson";

type Json = Record<string, unknown>;
type ListShape = { path: string; length: number; keys: string[]; dateKey: string | null; dateSample: string };

const MAX_DEPTH = 14;
const MAX_VISITED = 50_000;
const MAX_KEYS = 8;
const MAX_LISTS = 2;
const MAX_ENDPOINTS = 3;
const MAX_TEXT = 60;
const PATH_SEGMENTS = 3;

const DATE_LIKE = /\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4}/;
const TIME_TAG = /<time\b[^>]*\bdatetime\s*=/gi;
const ARTICLE_TAG = /<article\b/gi;
/** Direcciones de API en el HTML (WordPress, GraphQL, `/api/`): sirven para leer los datos sin pasar por la pagina. */
const ENDPOINT = /(?:https?:)?(?:\/\/[^\s"'<>\\]{1,200})?\/(?:wp-json|graphql|api)(?=[/?#\s"'<>\\]|$)[^\s"'<>\\]{0,200}/gi;

function isRecord(value: unknown): value is Json {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function clip(text: string): string {
  return text.length > MAX_TEXT ? `${text.slice(0, MAX_TEXT)}…` : text;
}

function findLists(value: unknown, path: string[], found: ListShape[], state: { visited: number }, depth = 0): void {
  if (depth > MAX_DEPTH || state.visited >= MAX_VISITED) return;
  state.visited += 1;

  if (Array.isArray(value)) {
    const first = value.find(isRecord);
    if (first) {
      const dateEntry = Object.entries(first).find(([, item]) => typeof item === "string" && DATE_LIKE.test(item));
      found.push({
        path: path.slice(-PATH_SEGMENTS).join("."),
        length: value.length,
        keys: Object.keys(first).slice(0, MAX_KEYS),
        dateKey: dateEntry?.[0] ?? null,
        dateSample: dateEntry ? clip(String(dateEntry[1])) : "",
      });
    }
    value.forEach((item, index) => findLists(item, [...path, String(index)], found, state, depth + 1));
    return;
  }
  if (!isRecord(value)) return;
  for (const [key, item] of Object.entries(value)) findLists(item, [...path, key], found, state, depth + 1);
}

/** Las listas de objetos del JSON: primero las que traen una fecha y luego las mas largas. */
function pickLists(value: unknown): ListShape[] {
  const found: ListShape[] = [];
  findLists(value, [], found, { visited: 0 });
  // Los elementos de una lista repiten su forma: se queda una por ruta.
  const byPath = new Map<string, ListShape>();
  for (const list of found) {
    const known = byPath.get(list.path);
    if (!known || list.length > known.length) byPath.set(list.path, list);
  }
  return [...byPath.values()]
    .sort((a, b) => Number(b.dateKey !== null) - Number(a.dateKey !== null) || b.length - a.length)
    .slice(0, MAX_LISTS);
}

function describeList({ path, length, keys, dateKey, dateSample }: ListShape): string {
  const date = dateKey ? ` ${dateKey}=${dateSample}` : "";
  return `${path || "raíz"}[${length}]{${keys.join(",")}}${date}`;
}

/** `props.pageProps` de Next.js (Pages Router): sus claves dicen si los datos vienen en la pagina o se piden despues. */
function describePageProps(value: unknown): string | null {
  if (!isRecord(value) || !isRecord(value.props) || !isRecord(value.props.pageProps)) return null;
  const keys = Object.keys(value.props.pageProps);
  return keys.length === 0 ? "pageProps vacío" : `pageProps{${keys.slice(0, MAX_KEYS * 2).join(",")}}`;
}

function describeEntry({ label, value }: EmbeddedJson): string {
  const pageProps = label === "__NEXT_DATA__" ? describePageProps(value) : null;
  const lists = pickLists(value).map(describeList);
  const shape = [pageProps, ...lists].filter(Boolean).join(" ");
  return shape ? `${label}: ${shape}` : label;
}

function findEndpoints(html: string): string[] {
  const found = new Set<string>();
  for (const match of html.matchAll(ENDPOINT)) {
    found.add(clip(match[0].replace(/^\/\//, "")));
    if (found.size >= MAX_ENDPOINTS) break;
  }
  return [...found];
}

/**
 * Resume lo que una pagina trae aparte de JSON-LD cuando no se pudieron leer eventos: el JSON
 * embebido (con las listas de objetos y sus campos), las etiquetas `<time>` y `<article>` y las
 * direcciones de API que aparecen en el HTML. Sirve para saber como leer esa fuente.
 */
export function describeEmbeddedData(html: string, embedded: ReadonlyArray<EmbeddedJson>): string {
  const parts: string[] = [];

  if (embedded.some(({ label }) => label === "RSC")) parts.push("Next.js (App Router)");
  parts.push(...embedded.slice(0, 3).map(describeEntry));
  if (embedded.length > 3) parts.push(`${embedded.length - 3} JSON más`);

  parts.push(`etiquetas time: ${html.match(TIME_TAG)?.length ?? 0}, article: ${html.match(ARTICLE_TAG)?.length ?? 0}`);

  const endpoints = findEndpoints(html);
  if (endpoints.length > 0) parts.push(`API: ${endpoints.join(" ")}`);

  return parts.join(", ");
}
