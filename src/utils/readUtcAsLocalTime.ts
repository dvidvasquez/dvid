import { EVENTS_UTC_OFFSET } from "@/constants/events";
import type { JsonLdNode } from "./collectJsonLdEvents";

const UTC_SUFFIX = /(T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)(?:Z|[+-]00:?00)$/i;
const DATE_FIELDS = ["startDate", "endDate"] as const;

/**
 * Algunos sitios escriben la hora local pero la marcan como UTC (`2026-11-14T10:00:00Z` para un
 * evento a las 10 a. m. en Medellín). Esto cambia esa marca por la hora de Colombia en el inicio y
 * el fin del evento, sin tocar la hora. Las fechas sin hora o con otra zona quedan igual.
 */
export function readUtcAsLocalTime(node: JsonLdNode): JsonLdNode {
  const fixed: JsonLdNode = { ...node };
  for (const field of DATE_FIELDS) {
    const value = fixed[field];
    if (typeof value === "string") fixed[field] = value.trim().replace(UTC_SUFFIX, `$1${EVENTS_UTC_OFFSET}`);
  }
  return fixed;
}
