import type { AgendaEvent, DayRange, EventDayGroup, EventOccurrence } from "@/types/event";
import { getEventDayKeys } from "./getEventDayKeys";
import { isEventFinished } from "./isEventFinished";
import { toDayKey } from "./toDayKey";

/**
 * Agrupa los eventos por dia dentro de `range`. Un evento de varios dias sale una vez por dia,
 * y de hoy se ocultan los que ya terminaron. Solo se listan los dias con eventos.
 */
export function groupEventsByDay(events: AgendaEvent[], range: DayRange, nowMs: number): EventDayGroup[] {
  const todayKey = toDayKey(nowMs);
  const byDay = new Map<string, EventOccurrence[]>();

  for (const event of events) {
    const dayKeys = getEventDayKeys(event);
    dayKeys.forEach((dayKey, index) => {
      if (dayKey < range.from || dayKey > range.to) return;
      if (dayKey === todayKey && isEventFinished(event, nowMs)) return;
      const occurrence = { event, dayKey, dayNumber: index + 1, dayCount: dayKeys.length };
      byDay.set(dayKey, [...(byDay.get(dayKey) ?? []), occurrence]);
    });
  }

  return [...byDay.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([dayKey, occurrences]) => ({
      dayKey,
      occurrences: occurrences.sort((a, b) => Date.parse(a.event.start) - Date.parse(b.event.start)),
    }));
}
