import { EVENTS_UTC_OFFSET_MINUTES } from "@/constants/events";
import type { AgendaEvent } from "@/types/event";
import { formatHour } from "./formatHour";

/** Hora de inicio en Colombia (`6 p. m.`), o `Todo el día`. */
export function formatEventTime(event: Pick<AgendaEvent, "start" | "allDay">): string {
  if (event.allDay) return "Todo el día";
  const ms = Date.parse(event.start);
  if (!Number.isFinite(ms)) return "";
  const local = new Date(ms + EVENTS_UTC_OFFSET_MINUTES * 60_000);
  return formatHour(local.getUTCHours(), local.getUTCMinutes());
}
