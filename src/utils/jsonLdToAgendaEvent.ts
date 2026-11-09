import type { EventSource } from "@/constants/eventSources";
import { EVENT_EXCERPT_LENGTH } from "@/constants/events";
import type { AgendaEvent, EventCategory } from "@/types/event";
import type { JsonLdNode } from "./collectJsonLdEvents";
import { getExcerpt } from "./getExcerpt";
import { inferEventCategory } from "./inferEventCategory";
import { parseEventPrice } from "./parseEventPrice";
import { parseSchemaDate } from "./parseSchemaDate";
import { stripHtml } from "./stripHtml";
import { toSafeHttpsUrl } from "./toSafeHttpsUrl";

type Json = Record<string, unknown>;

export type JsonLdSource = Pick<EventSource, "nombre" | "url"> & {
  /** Categoria a usar cuando el titulo no deja saber el genero (p. ej. la pagina "metal" de un sitio). */
  categoryHint?: EventCategory;
};

const MUSIC_GENRES: ReadonlySet<EventCategory> = new Set(["punk", "metal", "rock", "electronica", "urbano"]);
const COLOMBIAN_PESO = "COP";

function isRecord(value: unknown): value is Json {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function str(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

function toList(value: unknown): unknown[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

/** Resuelve URLs relativas contra la pagina de origen; solo deja pasar `https://`. */
function toUrl(value: unknown, pageUrl: string): string | null {
  const text = str(value).trim();
  if (!text) return null;
  try {
    return toSafeHttpsUrl(new URL(text, pageUrl).href);
  } catch {
    return null;
  }
}

/** La imagen puede ser un texto, un `ImageObject` o una lista de ambos. */
function readImage(value: unknown, pageUrl: string): string | null {
  for (const item of toList(value)) {
    const url = toUrl(isRecord(item) ? item.url : item, pageUrl);
    if (url) return url;
  }
  return null;
}

function readLocation(value: unknown): { venue: string; municipality: string | null } {
  const place = toList(value).find(isRecord);
  if (!place) return { venue: stripHtml(str(toList(value)[0])), municipality: null };

  const address = isRecord(place.address) ? place.address : {};
  const venue = stripHtml(str(place.name)) || stripHtml(str(address.streetAddress)) || stripHtml(str(place.address));
  return { venue, municipality: stripHtml(str(address.addressLocality)) || null };
}

/** Precio minimo en pesos de `offers`. Una moneda distinta al peso no se convierte: queda sin precio. */
function readPrice(raw: Json): number | null {
  if (raw.isAccessibleForFree === true) return 0;

  const amounts: string[] = [];
  for (const offer of toList(raw.offers).filter(isRecord)) {
    const currency = str(offer.priceCurrency).trim().toUpperCase();
    if (currency && currency !== COLOMBIAN_PESO) continue;
    for (const key of ["price", "lowPrice"]) {
      if (str(offer[key])) amounts.push(str(offer[key]));
    }
  }
  return parseEventPrice("", amounts);
}

function readGenres(raw: Json): string[] {
  const performers = toList(raw.performer).filter(isRecord);
  return [raw.genre, ...performers.map((performer) => performer.genre)].flatMap(toList).map(str).filter(Boolean);
}

function typeHint(raw: Json): EventCategory | null {
  const types = toList(raw["@type"]).map(str).join(" ");
  if (/MusicEvent/.test(types)) return "musica";
  if (/TheaterEvent|DanceEvent|ComedyEvent/.test(types)) return "teatro";
  if (/Festival|FoodEvent/.test(types)) return "feria";
  return null;
}

function pickCategory(inferred: EventCategory, raw: Json, source: JsonLdSource): EventCategory {
  if (inferred === "otro") {
    // Teatro o feria dicen mas que una pista de musica de la pagina.
    const byType = typeHint(raw);
    if (byType && byType !== "musica") return byType;
    return source.categoryHint ?? byType ?? "otro";
  }
  if (inferred === "musica" && source.categoryHint && MUSIC_GENRES.has(source.categoryHint)) return source.categoryHint;
  return inferred;
}

/**
 * Evento de schema.org (JSON-LD) -> evento de la agenda. Da `null` si no tiene titulo o fecha de
 * inicio, si esta cancelado o aplazado, o si es solo en linea. `pageUrl` es la pagina de donde salio
 * (para completar URLs relativas).
 */
export function jsonLdToAgendaEvent(raw: JsonLdNode, source: JsonLdSource, pageUrl: string = source.url): AgendaEvent | null {
  const title = stripHtml(str(raw.name));
  const start = parseSchemaDate(raw.startDate);
  if (!title || !start) return null;

  if (/Cancel|Postpone/i.test(str(raw.eventStatus))) return null;
  if (/OnlineEventAttendanceMode/.test(str(raw.eventAttendanceMode))) return null;

  const end = parseSchemaDate(raw.endDate, { endOfDay: start.dateOnly });
  const description = stripHtml(str(raw.description));
  const { venue, municipality } = readLocation(raw.location);
  const eventUrl = toUrl(raw.url, pageUrl) ?? toUrl(toList(raw.offers).find(isRecord)?.url, pageUrl);
  const url = eventUrl ?? source.url;
  const inferred = inferEventCategory({ title, categories: readGenres(raw), description });

  return {
    id: str(raw["@id"]) || eventUrl || `${source.nombre}|${title}|${start.iso}`,
    title,
    category: pickCategory(inferred, raw, source),
    start: start.iso,
    end: end && end.iso > start.iso ? end.iso : null,
    allDay: start.dateOnly,
    venue,
    municipality,
    price: readPrice(raw),
    image: readImage(raw.image, pageUrl),
    excerpt: getExcerpt(description, EVENT_EXCERPT_LENGTH),
    source: source.nombre,
    url,
  };
}
