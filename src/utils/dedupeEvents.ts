import type { AgendaEvent } from "@/types/event";
import { foldText } from "./foldText";
import { toDayKey } from "./toDayKey";

function getKey(event: AgendaEvent): string {
  const title = foldText(event.title).replace(/[^a-z0-9]+/g, " ").trim();
  return `${title}|${toDayKey(event.start)}`;
}

/** De dos fuentes distintas para el mismo evento conviene la que trae imagen; luego la mas completa. */
function pickBest(current: AgendaEvent, candidate: AgendaEvent): AgendaEvent {
  if (Boolean(candidate.image) !== Boolean(current.image)) return candidate.image ? candidate : current;
  return candidate.excerpt.length > current.excerpt.length ? candidate : current;
}

/** Quita eventos repetidos (mismo titulo el mismo dia), conservando el orden de aparicion. */
export function dedupeEvents(events: AgendaEvent[]): AgendaEvent[] {
  const best = new Map<string, AgendaEvent>();
  for (const event of events) {
    const key = getKey(event);
    const existing = best.get(key);
    best.set(key, existing ? pickBest(existing, event) : event);
  }
  return [...best.values()];
}
