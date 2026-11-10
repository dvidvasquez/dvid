import { DEFAULT_EVENT_DURATION_HOURS } from "@/constants/events";
import type { SavedEvent } from "@/types/event";
import { addDaysToKey } from "./addDaysToKey";
import { getOccurrenceKey } from "./getOccurrenceKey";
import { toDayKey } from "./toDayKey";

const HOUR_MS = 3_600_000;
const MAX_LINE = 74;

/** Texto de iCalendar: se escapan `\`, `;`, `,` y los saltos de linea. */
function escapeText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/([;,])/g, "\\$1").replace(/\r?\n/g, "\\n");
}

/** Las lineas largas se parten y la continuacion empieza con un espacio (RFC 5545). */
function fold(line: string): string {
  const parts: string[] = [];
  for (let rest = line; rest.length > 0; rest = rest.slice(MAX_LINE)) parts.push(rest.slice(0, MAX_LINE));
  return parts.join("\r\n ");
}

/** `2026-11-14T23:00:00.000Z` -> `20261114T230000Z`. */
function toUtcStamp(ms: number): string {
  return new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function toDateStamp(dayKey: string): string {
  return dayKey.replaceAll("-", "");
}

/**
 * Cada guardado es un dia concreto. Si es el dia en que el evento empieza (y tiene hora) va con su
 * hora; si es otro dia de un evento largo, o el evento no tiene hora, va como dia completo.
 */
function buildDates({ event, dayKey }: SavedEvent): string[] {
  const startMs = Date.parse(event.start);
  if (event.allDay || toDayKey(startMs) !== dayKey) {
    return [`DTSTART;VALUE=DATE:${toDateStamp(dayKey)}`, `DTEND;VALUE=DATE:${toDateStamp(addDaysToKey(dayKey, 1))}`];
  }

  const endMs = event.end ? Date.parse(event.end) : NaN;
  const sameDayEnd = Number.isFinite(endMs) && endMs > startMs && toDayKey(endMs) === dayKey;
  const end = sameDayEnd ? endMs : startMs + DEFAULT_EVENT_DURATION_HOURS * HOUR_MS;
  return [`DTSTART:${toUtcStamp(startMs)}`, `DTEND:${toUtcStamp(end)}`];
}

function buildEvent(saved: SavedEvent, stamp: string): string[] {
  const { event, dayKey } = saved;
  const uid = getOccurrenceKey(event, dayKey).replace(/[^a-z0-9]+/g, "-");
  const place = [event.venue, event.municipality].filter(Boolean).join(", ");
  const description = [event.excerpt, event.url].filter(Boolean).join("\n\n");

  return [
    "BEGIN:VEVENT",
    `UID:${uid}@agenda.cuartel-digital`,
    `DTSTAMP:${stamp}`,
    ...buildDates(saved),
    `SUMMARY:${escapeText(event.title)}`,
    ...(place ? [`LOCATION:${escapeText(place)}`] : []),
    `DESCRIPTION:${escapeText(description)}`,
    `URL:${event.url}`,
    "END:VEVENT",
  ];
}

/**
 * Los eventos guardados como archivo iCalendar (`.ics`), para importarlos en el calendario del
 * telefono o del computador. `nowMs` es la fecha de creacion que pide el formato.
 */
export function buildSavedEventsIcs(saved: ReadonlyArray<SavedEvent>, nowMs: number): string {
  const stamp = toUtcStamp(nowMs);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mi Cuartel Digital//Agenda//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Agenda guardada",
    ...saved.flatMap((item) => buildEvent(item, stamp)),
    "END:VCALENDAR",
  ];
  return `${lines.map(fold).join("\r\n")}\r\n`;
}
