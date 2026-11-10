import { MAX_SAVED_EVENTS } from "@/constants/events";
import type { AgendaEvent, SavedEvent } from "@/types/event";
import { getOccurrenceKey } from "./getOccurrenceKey";
import { isEventFinished } from "./isEventFinished";
import { toDayKey } from "./toDayKey";

/**
 * Guarda el evento en ese dia si no estaba y lo quita si ya estaba (se compara por titulo y dia, no
 * por fuente). Los otros dias del mismo evento no se tocan. De paso se sueltan los guardados cuyo
 * dia o evento ya paso. Si se pasa del tope, salen los mas viejos.
 */
export function toggleSavedEvent(saved: ReadonlyArray<SavedEvent>, event: AgendaEvent, dayKey: string, nowMs: number): SavedEvent[] {
  const todayKey = toDayKey(nowMs);
  const key = getOccurrenceKey(event, dayKey);
  const current = saved.filter((item) => item.dayKey >= todayKey && !isEventFinished(item.event, nowMs));
  const without = current.filter((item) => getOccurrenceKey(item.event, item.dayKey) !== key);

  if (without.length < current.length) return without;
  return [...without, { event, dayKey }].slice(-MAX_SAVED_EVENTS);
}
