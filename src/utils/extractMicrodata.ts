import type { JsonLdNode } from "./collectJsonLdEvents";
import { getVisibleText } from "./getVisibleText";
import { type HtmlElement, parseHtmlTree } from "./parseHtmlTree";
import { repairBrokenDateTime } from "./repairBrokenDateTime";
import { stripHtml } from "./stripHtml";

const MAX_EVENTS = 500;
const MAX_DEPTH = 8;
const DATE_PROPS = ["startDate", "endDate"] as const;

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

const EVENT_TYPE = /schema\.org\/([A-Za-z]*Event|Festival)\b/i;

/** Valor de una propiedad segun su etiqueta, como indica la especificacion de microdatos. */
function readValue(element: HtmlElement): string {
  const { tag, attrs } = element;
  if (tag === "meta") return stripHtml(attrs.content ?? "");
  if (URL_ATTRIBUTE[tag]) return stripHtml(attrs[URL_ATTRIBUTE[tag]] ?? "");
  if (tag === "data" || tag === "meter") return stripHtml(attrs.value ?? getVisibleText(element));
  if (tag === "time") return stripHtml(attrs.datetime ?? getVisibleText(element));
  return getVisibleText(element);
}

/** Propiedades de un elemento con `itemscope`: las suyas, sin las de los elementos con `itemscope` de dentro. */
function readScope(element: HtmlElement, depth: number): JsonLdNode {
  const typeUrl = (element.attrs.itemtype ?? "").split(/\s+/).find((type) => EVENT_TYPE.test(type)) ?? element.attrs.itemtype ?? "";
  const node: JsonLdNode = { "@type": typeUrl.split("/").filter(Boolean).pop() ?? "Thing" };

  const collect = (children: Array<HtmlElement | string>) => {
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

function findEventScopes(element: HtmlElement, found: HtmlElement[]): void {
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
  const scopes: HtmlElement[] = [];
  findEventScopes(parseHtmlTree(html), scopes);

  return scopes.map((scope) => {
    const node = readScope(scope, 0);
    const text = getVisibleText(scope);
    for (const prop of DATE_PROPS) {
      const value = node[prop];
      if (typeof value === "string") node[prop] = repairBrokenDateTime(value, text);
    }
    return node;
  });
}
