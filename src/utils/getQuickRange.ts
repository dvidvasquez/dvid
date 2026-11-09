import type { QuickRangeId } from "@/constants/events";
import type { DayRange } from "@/types/event";
import { addDaysToKey } from "./addDaysToKey";
import { parseLocalTime } from "./parseLocalTime";

const SATURDAY = 6;

function getWeekday(dayKey: string): number {
  const { year, month, day } = parseLocalTime(dayKey);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

/**
 * Rango de dias de un atajo, contando desde `todayKey`. "Fin de semana" es sabado y domingo:
 * si hoy ya es fin de semana, empieza hoy.
 */
export function getQuickRange(id: QuickRangeId, todayKey: string): DayRange {
  switch (id) {
    case "today":
      return { from: todayKey, to: todayKey };
    case "tomorrow": {
      const tomorrow = addDaysToKey(todayKey, 1);
      return { from: tomorrow, to: tomorrow };
    }
    case "week":
      return { from: todayKey, to: addDaysToKey(todayKey, 6) };
    case "month":
      return { from: todayKey, to: addDaysToKey(todayKey, 29) };
    case "weekend": {
      const weekday = getWeekday(todayKey);
      if (weekday === 0) return { from: todayKey, to: todayKey };
      const saturday = addDaysToKey(todayKey, SATURDAY - weekday);
      return { from: saturday, to: addDaysToKey(saturday, 1) };
    }
  }
}
