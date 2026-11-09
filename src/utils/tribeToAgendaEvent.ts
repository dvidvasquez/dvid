import type { EventSource } from "@/constants/eventSources";
import { EVENT_EXCERPT_LENGTH, EVENTS_TIME_ZONE } from "@/constants/events";
import type { AgendaEvent } from "@/types/event";
import { getExcerpt } from "./getExcerpt";
import { inferEventCategory } from "./inferEventCategory";
import { parseEventPrice } from "./parseEventPrice";
import { stripHtml } from "./stripHtml";
import { toIsoInZone } from "./toIsoInZone";
import { toSafeHttpsUrl } from "./toSafeHttpsUrl";

type Json = Record<string, unknown>;

function isRecord(value: unknown): value is Json {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function str(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

/** `2025-08-23 08:00:00` (UTC) -> ISO. */
function utcToIso(value: string): string | null {
  const ms = Date.parse(`${value.trim().replace(" ", "T")}Z`);
  return Number.isFinite(ms) ? new Date(ms).toISOString() : null;
}

/** Prefiere la fecha en UTC que da la API; si falta, lee la fecha local en la zona del evento. */
function readInstant(utc: unknown, local: unknown, timeZone: string): string | null {
  const fromUtc = str(utc) ? utcToIso(str(utc)) : null;
  if (fromUtc) return fromUtc;
  return str(local) ? toIsoInZone(str(local).trim().replace(" ", "T").slice(0, 16), timeZone) : null;
}

/**
 * Evento de la API REST de The Events Calendar (`/wp-json/tribe/events/v1/events`) -> evento
 * de la agenda. Es tolerante: cualquier campo puede faltar o venir con otro tipo.
 */
export function tribeToAgendaEvent(raw: unknown, source: Pick<EventSource, "nombre" | "url">): AgendaEvent | null {
  if (!isRecord(raw)) return null;

  const title = stripHtml(str(raw.title));
  const timeZone = str(raw.timezone) || EVENTS_TIME_ZONE;
  const start = readInstant(raw.utc_start_date, raw.start_date, timeZone);
  if (!title || !start) return null;
  const end = readInstant(raw.utc_end_date, raw.end_date, timeZone);

  const venue = isRecord(raw.venue) ? raw.venue : {};
  const image = isRecord(raw.image) ? str(raw.image.url) : "";
  const categories = Array.isArray(raw.categories)
    ? raw.categories.map((category) => (isRecord(category) ? stripHtml(str(category.name)) : "")).filter(Boolean)
    : [];
  const costValues = isRecord(raw.cost_details) && Array.isArray(raw.cost_details.values) ? raw.cost_details.values.map(str) : [];
  const description = stripHtml(str(raw.description) || str(raw.excerpt));
  const url = toSafeHttpsUrl(str(raw.url)) ?? source.url;

  return {
    id: str(raw.id) || url,
    title,
    category: inferEventCategory({ title, categories, description }),
    start,
    end: end && end > start ? end : null,
    allDay: raw.all_day === true,
    venue: stripHtml(str(venue.venue)),
    municipality: stripHtml(str(venue.city)) || null,
    price: parseEventPrice(str(raw.cost), costValues),
    image: toSafeHttpsUrl(image),
    excerpt: getExcerpt(description, EVENT_EXCERPT_LENGTH),
    source: source.nombre,
    url,
  };
}
