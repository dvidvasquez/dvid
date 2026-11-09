import { parseLocalTime } from "./parseLocalTime";

/** `2026-11-08` + 3 -> `2026-11-11`. Admite negativos y cruza meses y anos. */
export function addDaysToKey(dayKey: string, days: number): string {
  const { year, month, day } = parseLocalTime(dayKey);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}
