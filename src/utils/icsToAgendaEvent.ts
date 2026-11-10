import type { EventSource } from "@/constants/eventSources";
import { EVENT_EXCERPT_LENGTH, EVENTS_TIME_ZONE } from "@/constants/events";
import type { AgendaEvent } from "@/types/event";
import { getExcerpt } from "./getExcerpt";
import { icsDateTimeToIso } from "./icsDateTimeToIso";
import { inferEventCategory } from "./inferEventCategory";
import { parseEventLocation } from "./parseEventLocation";
import type { IcsEvent } from "./parseIcs";
import { stripHtml } from "./stripHtml";
import { toSafeHttpsUrl } from "./toSafeHttpsUrl";

/** `VEVENT` -> evento de la agenda. Da `null` si no tiene titulo o una fecha de inicio valida. */
export function icsToAgendaEvent(
  event: IcsEvent,
  source: Pick<EventSource, "nombre" | "url">,
  defaultTimeZone = EVENTS_TIME_ZONE,
): AgendaEvent | null {
  const title = stripHtml(event.summary);
  if (!title || !event.start) return null;

  const start = icsDateTimeToIso(event.start, defaultTimeZone);
  if (!start) return null;
  const end = event.end ? icsDateTimeToIso(event.end, defaultTimeZone) : null;

  const description = stripHtml(event.description);
  const { venue, municipality } = parseEventLocation(event.location);
  const url = toSafeHttpsUrl(event.url) ?? source.url;

  return {
    id: event.uid || url,
    title,
    category: inferEventCategory({ title, categories: event.categories, description, venue }),
    start,
    end: end && end > start ? end : null,
    allDay: event.start.dateOnly,
    venue,
    municipality,
    price: null,
    image: toSafeHttpsUrl(event.image),
    excerpt: getExcerpt(description, EVENT_EXCERPT_LENGTH),
    source: source.nombre,
    url,
  };
}
