import { EVENT_CATEGORIES, MAX_SAVED_EVENTS } from "@/constants/events";
import type { AgendaEvent, EventCategory, SavedEvent } from "@/types/event";
import { toDayKey } from "./toDayKey";
import { toSafeHttpsUrl } from "./toSafeHttpsUrl";

const DAY_KEY = /^\d{4}-\d{2}-\d{2}$/;
const CATEGORY_IDS: ReadonlySet<string> = new Set(EVENT_CATEGORIES.map(({ id }) => id));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function isoDate(value: unknown): string | null {
  return typeof value === "string" && Number.isFinite(Date.parse(value)) ? value : null;
}

/** Un evento guardado solo vale si conserva lo minimo para mostrarlo: id, titulo, inicio y enlace https. */
function toEvent(raw: unknown): AgendaEvent | null {
  if (!isRecord(raw)) return null;

  const id = text(raw.id);
  const title = text(raw.title);
  const start = isoDate(raw.start);
  const url = toSafeHttpsUrl(raw.url);
  if (!id || !title || !start || !url) return null;

  const category = text(raw.category);
  return {
    id,
    title,
    category: CATEGORY_IDS.has(category) ? (category as EventCategory) : "otro",
    start,
    end: isoDate(raw.end),
    allDay: raw.allDay === true,
    venue: text(raw.venue),
    municipality: text(raw.municipality) || null,
    price: typeof raw.price === "number" && Number.isFinite(raw.price) && raw.price >= 0 ? raw.price : null,
    image: toSafeHttpsUrl(raw.image),
    excerpt: text(raw.excerpt),
    source: text(raw.source),
    url,
  };
}

/**
 * Un guardado es `{ event, dayKey }`. La primera version guardaba el evento suelto, sin dia: esos
 * se leen como guardados en su dia de inicio.
 */
function toSaved(raw: unknown): SavedEvent | null {
  if (!isRecord(raw)) return null;

  if (!("event" in raw)) {
    const event = toEvent(raw);
    return event ? { event, dayKey: toDayKey(event.start) } : null;
  }
  const event = toEvent(raw.event);
  const dayKey = text(raw.dayKey);
  return event && DAY_KEY.test(dayKey) ? { event, dayKey } : null;
}

/**
 * Los eventos guardados en el navegador (texto JSON) -> lista de guardados. Lo que no sea una lista
 * o no parezca un guardado se descarta: el almacenamiento puede estar vacio, viejo o editado a mano.
 */
export function parseSavedEvents(stored: string): SavedEvent[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(stored);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  return parsed
    .map(toSaved)
    .filter((saved): saved is SavedEvent => saved !== null)
    .slice(0, MAX_SAVED_EVENTS);
}
