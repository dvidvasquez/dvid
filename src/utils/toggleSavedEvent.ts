import { MAX_SAVED_EVENTS } from "@/constants/events";
import type { AgendaEvent } from "@/types/event";
import { getEventKey } from "./getEventKey";
import { isEventFinished } from "./isEventFinished";

/**
 * Guarda el evento si no estaba y lo quita si ya estaba (se compara por titulo y dia, no por fuente).
 * De paso se sueltan los guardados que ya terminaron. Si se pasa del tope, salen los mas viejos.
 */
export function toggleSavedEvent(saved: ReadonlyArray<AgendaEvent>, event: AgendaEvent, nowMs: number): AgendaEvent[] {
  const key = getEventKey(event);
  const current = saved.filter((item) => !isEventFinished(item, nowMs));
  const without = current.filter((item) => getEventKey(item) !== key);

  if (without.length < current.length) return without;
  return [...without, event].slice(-MAX_SAVED_EVENTS);
}
