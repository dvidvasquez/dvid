import {
  EVENT_SOURCE_VIA_LABELS,
  EVENT_SOURCES,
  type EventSource,
  type EventSourceVia,
  type JsonLdPage,
} from "@/constants/eventSources";
import { EVENTS_WINDOW_DAYS } from "@/constants/events";
import type { AgendaEvent, DayRange } from "@/types/event";
import { addDaysToKey } from "@/utils/addDaysToKey";
import { collectJsonLdEvents } from "@/utils/collectJsonLdEvents";
import { dedupeEvents } from "@/utils/dedupeEvents";
import { extractJsonLd } from "@/utils/extractJsonLd";
import { getEventDayKeys } from "@/utils/getEventDayKeys";
import { icsToAgendaEvent } from "@/utils/icsToAgendaEvent";
import { isEventFinished } from "@/utils/isEventFinished";
import { jsonLdToAgendaEvent } from "@/utils/jsonLdToAgendaEvent";
import { parseIcs } from "@/utils/parseIcs";
import { toDayKey } from "@/utils/toDayKey";
import { toSafeHttpsUrl } from "@/utils/toSafeHttpsUrl";
import { tribeToAgendaEvent } from "@/utils/tribeToAgendaEvent";

/** 3 horas. Mantener igual al `revalidate` de la pagina de agenda. */
export const EVENTS_REVALIDATE_SECONDS = 10800;

const REQUEST_TIMEOUT_MS = 8000;
const REST_PAGE_SIZE = 50;
const MAX_REST_PAGES = 6;
const USER_AGENT = "Mozilla/5.0 (compatible; DvidAgenda/1.0; agenda personal de eventos)";

export type EventSourceStatus = {
  source: EventSource;
  /** `sin-eventos`: la fuente respondio pero no hay nada en el rango. */
  status: "ok" | "sin-eventos" | "error";
  /** Por donde se leyeron los eventos. */
  via: EventSourceVia | null;
  eventCount: number;
  withImageCount: number;
  /** Que fallo o que le falto a la fuente; sirve para saber por que no hay eventos. */
  message?: string;
};

export type EventsFeed = {
  /** De la fecha mas cercana a la mas lejana, sin repetidos ni eventos que ya terminaron. */
  events: AgendaEvent[];
  statuses: EventSourceStatus[];
  /** ISO 8601: cuando se armo esta lista. */
  generatedAt: string;
};

/** `note` avisa de algo que no impidio leer eventos (p. ej. una pagina que fallo). */
type Loaded = { events: AgendaEvent[]; note?: string } | { error: string };

type IcsSource = Extract<EventSource, { icsUrl: string }>;

async function fetchText(url: string, accept: string): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: accept },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      next: { revalidate: EVENTS_REVALIDATE_SECONDS },
    });
    if (!response.ok) return { ok: false, error: `HTTP ${response.status}` };
    return { ok: true, text: await response.text() };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.name : "Error de red" };
  }
}

function buildRestUrl(restUrl: string, window: DayRange): string {
  const url = new URL(restUrl);
  url.searchParams.set("start_date", window.from);
  url.searchParams.set("end_date", window.to);
  url.searchParams.set("per_page", String(REST_PAGE_SIZE));
  url.searchParams.set("page", "1");
  return url.href;
}

/** La API da la URL de la pagina siguiente; solo se sigue si es del mismo sitio. */
function getNextPageUrl(body: Record<string, unknown>, restUrl: string): string | null {
  const next = toSafeHttpsUrl(body.next_rest_url);
  return next && new URL(next).origin === new URL(restUrl).origin ? next : null;
}

async function loadTribeRest(source: Extract<EventSource, { kind: "tribe" }>, window: DayRange): Promise<Loaded> {
  const events: AgendaEvent[] = [];
  let url: string | null = buildRestUrl(source.restUrl, window);

  for (let page = 0; url && page < MAX_REST_PAGES; page += 1) {
    const result = await fetchText(url, "application/json");
    if (!result.ok) return page === 0 ? { error: result.error } : { events };

    let body: unknown;
    try {
      body = JSON.parse(result.text);
    } catch {
      return page === 0 ? { error: "La API no devolvio JSON" } : { events };
    }
    if (typeof body !== "object" || body === null) return page === 0 ? { error: "Respuesta inesperada" } : { events };

    const record = body as Record<string, unknown>;
    const list = Array.isArray(record.events) ? record.events : [];
    for (const raw of list) {
      const event = tribeToAgendaEvent(raw, source);
      if (event) events.push(event);
    }
    url = getNextPageUrl(record, source.restUrl);
  }

  return { events };
}

async function loadIcs(source: IcsSource): Promise<Loaded> {
  const result = await fetchText(source.icsUrl, "text/calendar, text/plain;q=0.8, */*;q=0.5");
  if (!result.ok) return { error: result.error };
  if (!result.text.includes("BEGIN:VCALENDAR")) return { error: "No es un calendario iCal" };

  const events = parseIcs(result.text)
    .map((event) => icsToAgendaEvent(event, source))
    .filter((event): event is AgendaEvent => event !== null);
  return { events };
}

/** Lee una pagina HTML: sus eventos y cuantos bloques de eventos trajo. */
async function loadJsonLdPage(
  source: Extract<EventSource, { kind: "jsonld" }>,
  page: JsonLdPage,
): Promise<{ events: AgendaEvent[]; structured: number } | { error: string }> {
  const result = await fetchText(page.url, "text/html,application/xhtml+xml;q=0.9,*/*;q=0.5");
  if (!result.ok) return { error: result.error };

  const nodes = collectJsonLdEvents(extractJsonLd(result.text));
  const pageSource = { nombre: source.nombre, url: source.url, categoryHint: page.categoryHint };
  const events = nodes
    .map((node) => jsonLdToAgendaEvent(node, pageSource, page.url))
    .filter((event): event is AgendaEvent => event !== null);
  return { events, structured: nodes.length };
}

async function loadJsonLd(source: Extract<EventSource, { kind: "jsonld" }>): Promise<Loaded> {
  const pages = await Promise.all(source.pages.map((page) => loadJsonLdPage(source, page)));
  const loaded = pages.flatMap((page) => ("error" in page ? [] : [page]));
  const failures = pages.flatMap((page) => ("error" in page ? [page.error] : []));

  if (loaded.length === 0) return { error: failures.join(", ") || "Sin paginas" };

  const events = loaded.flatMap((page) => page.events);
  const notes: string[] = [];
  if (failures.length > 0) notes.push(`${failures.length} de ${pages.length} páginas fallaron (${failures.join(", ")})`);
  if (events.length === 0 && loaded.every((page) => page.structured === 0)) {
    notes.push("La página respondió pero no trae datos de eventos (JSON-LD)");
  }
  return { events, note: notes.length > 0 ? notes.join(" · ") : undefined };
}

function isInWindow(event: AgendaEvent, window: DayRange, nowMs: number): boolean {
  if (isEventFinished(event, nowMs)) return false;
  return getEventDayKeys(event).some((dayKey) => dayKey >= window.from && dayKey <= window.to);
}

async function loadSource(
  source: EventSource,
  window: DayRange,
  nowMs: number,
): Promise<{ status: EventSourceStatus; events: AgendaEvent[] }> {
  const attempts: Array<{ via: EventSourceVia; loaded: Loaded }> = [];
  const hasEvents = (loaded: Loaded) => "events" in loaded && loaded.events.some((e) => isInWindow(e, window, nowMs));

  if (source.kind === "jsonld") {
    attempts.push({ via: "jsonld", loaded: await loadJsonLd(source) });
  } else {
    if (source.kind === "tribe") attempts.push({ via: "rest", loaded: await loadTribeRest(source, window) });
    if (!attempts.some(({ loaded }) => hasEvents(loaded))) attempts.push({ via: "ics", loaded: await loadIcs(source) });
  }

  const notes = attempts.flatMap(({ loaded }) => ("note" in loaded && loaded.note ? [loaded.note] : []));
  const winner = attempts.find(({ loaded }) => hasEvents(loaded));
  if (winner && "events" in winner.loaded) {
    const events = winner.loaded.events.filter((event) => isInWindow(event, window, nowMs));
    const status: EventSourceStatus = {
      source,
      status: "ok",
      via: winner.via,
      eventCount: events.length,
      withImageCount: events.filter((event) => event.image).length,
      message: notes.length > 0 ? notes.join(" · ") : undefined,
    };
    return { status, events };
  }

  const errors = attempts.flatMap(({ via, loaded }) => ("error" in loaded ? [`${EVENT_SOURCE_VIA_LABELS[via]}: ${loaded.error}`] : []));
  const failed = errors.length === attempts.length;
  const details = [...errors, ...notes];
  return {
    status: {
      source,
      status: failed ? "error" : "sin-eventos",
      via: null,
      eventCount: 0,
      withImageCount: 0,
      message: details.length > 0 ? details.join(" · ") : undefined,
    },
    events: [],
  };
}

/** Proximos eventos de todas las fuentes (hasta `EVENTS_WINDOW_DAYS` dias), sin repetidos y en orden. */
export async function getEventsFeed(sources: EventSource[] = EVENT_SOURCES, now: Date = new Date()): Promise<EventsFeed> {
  const todayKey = toDayKey(now.getTime());
  const window = { from: todayKey, to: addDaysToKey(todayKey, EVENTS_WINDOW_DAYS) };

  const results = await Promise.all(sources.map((source) => loadSource(source, window, now.getTime())));
  const events = dedupeEvents(results.flatMap((result) => result.events)).sort(
    (a, b) => Date.parse(a.start) - Date.parse(b.start),
  );

  return { events, statuses: results.map((result) => result.status), generatedAt: now.toISOString() };
}
