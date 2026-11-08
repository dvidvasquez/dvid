import { parseLocalTime } from "./parseLocalTime";

const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

/** El primer dia es `Hoy`; los demas `Lun 9`. */
export function getDayLabel(date: string, index: number): string {
  if (index === 0) return "Hoy";
  const { year, month, day } = parseLocalTime(date);
  const weekday = WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  return `${weekday} ${day}`;
}
