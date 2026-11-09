import type { IcsDateTime } from "./parseIcs";
import { toIsoInZone } from "./toIsoInZone";

/**
 * Fecha de un iCal -> ISO 8601 en UTC. Con `Z` ya esta en UTC; las demas se leen en su `TZID`
 * o, si no traen, en `defaultTimeZone`. Un dia completo empieza a medianoche de esa zona.
 */
export function icsDateTimeToIso(date: IcsDateTime, defaultTimeZone: string): string | null {
  if (date.utc) {
    const ms = Date.parse(`${date.value}:00Z`);
    return Number.isFinite(ms) ? new Date(ms).toISOString() : null;
  }
  const local = date.dateOnly ? `${date.value}T00:00` : date.value;
  return toIsoInZone(local, date.timeZone ?? defaultTimeZone);
}
