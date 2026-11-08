import { NBSP } from "@/constants/text";

/** `14, 5` -> `2:05 p. m.`; `0, 0` -> `12 a. m.` (con espacios duros). */
export function formatHour(hour: number, minute = 0): string {
  const meridiem = `${hour < 12 ? "a." : "p."}${NBSP}m.`;
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const clock = minute ? `${h12}:${String(minute).padStart(2, "0")}` : String(h12);
  return `${clock}${NBSP}${meridiem}`;
}
