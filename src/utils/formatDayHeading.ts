import { addDaysToKey } from "./addDaysToKey";
import { parseLocalTime } from "./parseLocalTime";

const WEEKDAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

/** `Hoy · domingo 8 de noviembre`, `Mañana · lunes 9 de noviembre` o `Martes 10 de noviembre`. */
export function formatDayHeading(dayKey: string, todayKey: string): string {
  const { year, month, day } = parseLocalTime(dayKey);
  const weekday = WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  const date = `${weekday} ${day} de ${MONTHS[month - 1]}`;

  if (dayKey === todayKey) return `Hoy · ${date}`;
  if (dayKey === addDaysToKey(todayKey, 1)) return `Mañana · ${date}`;
  return `${date.charAt(0).toUpperCase()}${date.slice(1)}`;
}
