import type { JsonLdNode } from "./collectJsonLdEvents";
import { getVisibleText } from "./getVisibleText";
import { type HtmlElement, parseHtmlTree } from "./parseHtmlTree";
import { parseSchemaDate } from "./parseSchemaDate";

const HEADING = /^h[1-6]$/;
/** Contenedores de toda la pagina: un titulo suelto ahi no es el de una tarjeta. */
const PAGE_TAGS = new Set(["#root", "html", "body"]);
const VENUE_CLASS = /venue|location|lugar|place|sede|ubicacion/i;
const MAX_CARDS = 300;
const MAX_CLIMB = 6;
const MAX_VENUE_LENGTH = 120;
const MIN_DESCRIPTION_LENGTH = 20;
const IMAGE_ATTRIBUTES = ["src", "data-src", "data-lazy-src", "data-original"];

type Located = { element: HtmlElement; ancestors: HtmlElement[] };

function elementChildren(element: HtmlElement): HtmlElement[] {
  return element.children.filter((child): child is HtmlElement => typeof child !== "string");
}

function findAll(element: HtmlElement, test: (element: HtmlElement) => boolean, found: HtmlElement[] = []): HtmlElement[] {
  for (const child of elementChildren(element)) {
    if (test(child)) found.push(child);
    findAll(child, test, found);
  }
  return found;
}

function findTimes(element: HtmlElement, ancestors: HtmlElement[], found: Located[]): void {
  for (const child of elementChildren(element)) {
    if (child.tag === "time" && parseSchemaDate(child.attrs.datetime)) found.push({ element: child, ancestors: [...ancestors, element] });
    else findTimes(child, [...ancestors, element], found);
  }
}

/**
 * La tarjeta de una fecha: el contenedor mas chico que tiene un titulo (h1-h6) y ningun otro.
 * Si el primero que tiene titulos trae varios, la fecha no se puede atar a un evento.
 */
function findCard(ancestors: HtmlElement[]): { card: HtmlElement; heading: HtmlElement } | null {
  for (const card of ancestors.slice(-MAX_CLIMB).reverse()) {
    if (PAGE_TAGS.has(card.tag)) return null;
    const headings = findAll(card, (element) => HEADING.test(element.tag));
    if (headings.length === 0) continue;
    return headings.length === 1 ? { card, heading: headings[0] } : null;
  }
  return null;
}

function readLink(card: HtmlElement, heading: HtmlElement): string {
  const isLink = (element: HtmlElement) =>
    element.tag === "a" && Boolean(element.attrs.href) && !/^(#|mailto:|tel:|javascript:)/i.test(element.attrs.href);
  const link = findAll(heading, isLink)[0] ?? findAll(card, isLink)[0];
  return link?.attrs.href ?? "";
}

function readImage(card: HtmlElement): string {
  for (const image of findAll(card, (element) => element.tag === "img")) {
    for (const attribute of IMAGE_ATTRIBUTES) {
      const url = image.attrs[attribute];
      if (url && !url.startsWith("data:")) return url;
    }
    const first = image.attrs.srcset?.trim().split(/\s+/)[0];
    if (first) return first;
  }
  return "";
}

function readVenue(card: HtmlElement): string {
  for (const element of findAll(card, (candidate) => VENUE_CLASS.test(candidate.attrs.class ?? ""))) {
    const text = getVisibleText(element);
    if (text && text.length <= MAX_VENUE_LENGTH) return text;
  }
  return "";
}

function readDescription(card: HtmlElement): string {
  for (const paragraph of findAll(card, (element) => element.tag === "p")) {
    const text = getVisibleText(paragraph);
    if (text.length >= MIN_DESCRIPTION_LENGTH) return text;
  }
  return "";
}

/**
 * Eventos de paginas que no traen datos estructurados pero marcan la fecha con `<time datetime>`:
 * cada fecha se ata al contenedor mas chico que tiene un solo titulo, y de ahi salen el nombre, el
 * enlace, la imagen, el lugar (un elemento con clase venue/lugar/location...) y el primer parrafo.
 * Si una tarjeta tiene dos fechas, la primera es el inicio y la segunda el fin.
 */
export function extractTimeCards(html: string): JsonLdNode[] {
  const times: Located[] = [];
  findTimes(parseHtmlTree(html), [], times);

  const cards = new Map<HtmlElement, { heading: HtmlElement; dates: string[] }>();
  for (const { element, ancestors } of times) {
    const found = findCard(ancestors);
    if (!found) continue;

    const entry = cards.get(found.card) ?? { heading: found.heading, dates: [] };
    entry.dates.push(element.attrs.datetime.trim());
    cards.set(found.card, entry);
    if (cards.size >= MAX_CARDS) break;
  }

  const nodes: JsonLdNode[] = [];
  for (const [card, { heading, dates }] of cards) {
    const name = getVisibleText(heading);
    if (!name) continue;

    const [startDate, endDate] = [...dates].sort();
    const node: JsonLdNode = { "@type": "Event", name, startDate };
    if (endDate && endDate !== startDate) node.endDate = endDate;

    const url = readLink(card, heading);
    if (url) node.url = url;
    const image = readImage(card);
    if (image) node.image = image;
    const venue = readVenue(card);
    if (venue) node.location = venue;
    const description = readDescription(card);
    if (description) node.description = description;

    nodes.push(node);
  }
  return nodes;
}
