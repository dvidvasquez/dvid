import type { AgendaEvent } from "@/types/event";
import { getEventKey } from "./getEventKey";

/**
 * Suma a la agenda los eventos guardados que las fuentes ya no traen (una fuente caida o un evento
 * que salio de su listado no debe borrar lo que se guardo). Si el evento sigue en la agenda se usa
 * esa version, que es la mas reciente. Sale ordenado por inicio.
 */
export function mergeSavedEvents(events: ReadonlyArray<AgendaEvent>, saved: ReadonlyArray<AgendaEvent>): AgendaEvent[] {
  const known = new Set(events.map(getEventKey));
  const missing: AgendaEvent[] = [];

  for (const event of saved) {
    const key = getEventKey(event);
    if (known.has(key)) continue;
    known.add(key);
    missing.push(event);
  }

  if (missing.length === 0) return [...events];
  return [...events, ...missing].sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
}
