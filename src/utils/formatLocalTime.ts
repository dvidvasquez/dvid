import { formatHour } from "./formatHour";
import { parseLocalTime } from "./parseLocalTime";

/** `2026-11-07T14:15` -> `2:15 p. m.` */
export function formatLocalTime(value: string): string {
  const { hour, minute } = parseLocalTime(value);
  return formatHour(hour, minute);
}
