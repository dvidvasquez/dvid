import type { JsonLdNode } from "./collectJsonLdEvents";
import { repairBrokenDateTime } from "./repairBrokenDateTime";
import { stripHtml } from "./stripHtml";

type Element = { tag: string; attrs: Record<string, string>; children: Array<Element | string> };

const MAX_EVENTS = 500;
const MAX_DEPTH = 8;
const DATE_PROPS = ["startDate", "endDate"] as const;

/** Etiquetas HTML que no tienen cierre. */
const VOID_TAGS = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
/** Etiquetas que el navegador cierra solas al abrir otra igual justo despues. */
const SELF_CLOSING_SIBLINGS = new Set(["li", "dt", "dd", "option", "tr", "td", "th", "p"]);
const URL_ATTRIBUTE: Record<string, string> = {
  a: "href",
  area: "href",
  link: "href",
  audio: "src",
  embed: "src",
  iframe: "src",
  img: "src",
  source: "src",
  track: "src",
  video: "src",
  object: "data",
};

const TOKEN = /<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>|<(\/?)([A-Za-z][A-Za-z0-9:-]*)((?:"[^"]*"|'[^']*'|[^'">])*)>/gi;
const ATTRIBUTE = /([^\s=/"'<>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'<>=`]+)))?/g;
const EVENT_TYPE = /schema\.org\/([A-Za-z]*Event|Festival)\b/i;

function parseAttributes(source: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const match of source.matchAll(ATTRIBUTE)) {
    const name = match[1].toLowerCase();
    if (!(name in attrs)) attrs[name] = match[2] ?? match[3] ?? match[4] ?? "";
  }
  return attrs;
}

/** Arbol HTML sencillo: suficiente para leer `itemscope` / `itemprop`, aunque falten cierres. */
function parseHtml(html: string): Element {
  const root: Element = { tag: "#root", attrs: {}, children: [] };
  const stack: Element[] = [root];
  let cursor = 0;

  const addText = (end: number) => {
    const text = html.slice(cursor, end);
    if (text.trim()) stack[stack.length - 1].children.push(text);
  };

  for (const match of html.matchAll(TOKEN)) {
    const start = match.index ?? 0;
    addText(start);
    cursor = start + match[0].length;

    const [, skipped, closing, rawTag, rawAttrs = ""] = match;
    if (skipped || !rawTag) continue; // comentarios, <script> y <style>

    const tag = rawTag.toLowerCase();
    if (closing) {
      const open = stack.map((element) => element.tag).lastIndexOf(tag);
      if (open > 0) stack.length = open;
      continue;
    }

    if (SELF_CLOSING_SIBLINGS.has(tag) && stack[stack.length - 1].tag === tag) stack.pop();

    const element: Element = { tag, attrs: parseAttributes(rawAttrs), children: [] };
    stack[stack.length - 1].children.push(element);
    if (!VOID_TAGS.has(tag) && !rawAttrs.trimEnd().endsWith("/")) stack.push(element);
  }

  addText(html.length);
  return root;
}

function textOf(node: Element | string): string {
  if (typeof node === "string") return node;
  return node.children.map(textOf).join(" ");
}

function visibleText(element: Element): string {
  return stripHtml(textOf(element));
}

/** Valor de una propiedad segun su etiqueta, como indica la especificacion de microdatos. */
function readValue(element: Element): string {
  const { tag, attrs } = element;
  if (tag === "meta") return stripHtml(attrs.content ?? "");
  if (URL_ATTRIBUTE[tag]) return stripHtml(attrs[URL_ATTRIBUTE[tag]] ?? "");
  if (tag === "data" || tag === "meter") return stripHtml(attrs.value ?? visibleText(element));
  if (tag === "time") return stripHtml(attrs.datetime ?? visibleText(element));
  return visibleText(element);
}

/** Propiedades de un elemento con `itemscope`: las suyas, sin las de los elementos con `itemscope` de dentro. */
function readScope(element: Element, depth: number): JsonLdNode {
  const typeUrl = (element.attrs.itemtype ?? "").split(/\s+/).find((type) => EVENT_TYPE.test(type)) ?? element.attrs.itemtype ?? "";
  const node: JsonLdNode = { "@type": typeUrl.split("/").filter(Boolean).pop() ?? "Thing" };

  const collect = (children: Array<Element | string>) => {
    for (const child of children) {
      if (typeof child === "string") continue;

      const isScope = "itemscope" in child.attrs;
      const names = (child.attrs.itemprop ?? "").split(/\s+/).filter(Boolean);
      if (names.length > 0) {
        const value = isScope ? (depth < MAX_DEPTH ? readScope(child, depth + 1) : "") : readValue(child);
        for (const name of names) if (value !== "" && !(name in node)) node[name] = value;
      }
      if (!isScope) collect(child.children);
    }
  };

  collect(element.children);
  return node;
}

function findEventScopes(element: Element, found: Element[]): void {
  if (found.length >= MAX_EVENTS) return;
  if ("itemscope" in element.attrs && EVENT_TYPE.test(element.attrs.itemtype ?? "")) {
    found.push(element);
    return;
  }
  for (const child of element.children) {
    if (typeof child !== "string") findEventScopes(child, found);
  }
}

/**
 * Eventos de schema.org escritos como microdatos (`itemscope itemtype=".../Event"` con `itemprop`)
 * en una pagina HTML. Da el mismo tipo de objeto que el JSON-LD, asi se leen igual. Los eventos
 * dentro de otros eventos no se cuentan aparte.
 */
export function extractMicrodata(html: string): JsonLdNode[] {
  const scopes: Element[] = [];
  findEventScopes(parseHtml(html), scopes);

  return scopes.map((scope) => {
    const node = readScope(scope, 0);
    const text = visibleText(scope);
    for (const prop of DATE_PROPS) {
      const value = node[prop];
      if (typeof value === "string") node[prop] = repairBrokenDateTime(value, text);
    }
    return node;
  });
}
