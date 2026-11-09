import { DEFAULT_EVENT_DURATION_HOURS } from "@/constants/events";
import type { AgendaEvent } from "@/types/event";

const HOUR_MS = 3_600_000;

/** Ya paso: termino antes de `nowMs`. Sin fin se supone una duracion corta (o un dia, si es de dia completo). */
export function isEventFinished(event: Pick<AgendaEvent, "start" | "end" | "allDay">, nowMs: number): boolean {
  const start = Date.parse(event.start);
  const end = event.end ? Date.parse(event.end) : start + (event.allDay ? 24 : DEFAULT_EVENT_DURATION_HOURS) * HOUR_MS;
  return end < nowMs;
}
