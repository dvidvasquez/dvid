export type JsonLdNode = Record<string, unknown>;

const MAX_DEPTH = 6;
const MAX_EVENTS = 500;

/** Subtipos de schema.org/Event (MusicEvent, TheaterEvent, Festival...). */
const EVENT_TYPE = /(^|\/)([A-Za-z]*Event|Festival)$/;

function isNode(value: unknown): value is JsonLdNode {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isEvent(node: JsonLdNode): boolean {
  const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
  return types.some((type) => typeof type === "string" && EVENT_TYPE.test(type));
}

function walk(value: unknown, depth: number, found: JsonLdNode[]): void {
  if (depth > MAX_DEPTH || found.length >= MAX_EVENTS) return;

  if (Array.isArray(value)) {
    for (const item of value) walk(item, depth + 1, found);
    return;
  }
  if (!isNode(value)) return;

  if (isEvent(value)) {
    found.push(value);
    return;
  }
  // Contenedores habituales: `@graph`, listas (`itemListElement` -> `item`) y colecciones.
  for (const key of ["@graph", "itemListElement", "item", "mainEntity", "event", "events"]) {
    if (key in value) walk(value[key], depth + 1, found);
  }
}

/**
 * Los eventos de schema.org dentro de los bloques JSON-LD de una pagina, sin importar si vienen
 * sueltos, en un arreglo, en un `@graph` o dentro de una lista (`ItemList`).
 */
export function collectJsonLdEvents(blocks: ReadonlyArray<unknown>): JsonLdNode[] {
  const found: JsonLdNode[] = [];
  for (const block of blocks) walk(block, 0, found);
  return found;
}
