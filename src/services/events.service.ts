import { EVENT_SOURCES, type EventSource } from "@/constants/eventSources";
import { EVENTS_WINDOW_DAYS } from "@/constants/events";
import type { AgendaEvent, DayRange } from "@/types/event";
import { addDaysToKey } from "@/utils/addDaysToKey";
import { dedupeEvents } from "@/utils/dedupeEvents";
import { getEventDayKeys } from "@/utils/getEventDayKeys";
import { icsToAgendaEvent } from "@/utils/icsToAgendaEvent";
import { isEventFinished } from "@/utils/isEventFinished";
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
  via: "rest" | "ics" | null;
  eventCount: number;
  withImageCount: number;
  message?: string;
};

export type EventsFeed = {
  /** De la fecha mas cercana a la mas lejana, sin repetidos ni eventos que ya terminaron. */
  events: AgendaEvent[];
  statuses: EventSourceStatus[];
  /** ISO 8601: cuando se armo esta lista. */
  generatedAt: string;
};

type Loaded = { events: AgendaEvent[] } | { error: string };

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

async function loadIcs(source: EventSource): Promise<Loaded> {
  const result = await fetchText(source.icsUrl, "text/calendar, text/plain;q=0.8, */*;q=0.5");
  if (!result.ok) return { error: result.error };
  if (!result.text.includes("BEGIN:VCALENDAR")) return { error: "No es un calendario iCal" };

  const events = parseIcs(result.text)
    .map((event) => icsToAgendaEvent(event, source))
    .filter((event): event is AgendaEvent => event !== null);
  return { events };
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
  const attempts: Array<{ via: "rest" | "ics"; loaded: Loaded }> = [];

  if (source.kind === "tribe") attempts.push({ via: "rest", loaded: await loadTribeRest(source, window) });
  const hasEvents = (loaded: Loaded) => "events" in loaded && loaded.events.some((e) => isInWindow(e, window, nowMs));
  if (!attempts.some(({ loaded }) => hasEvents(loaded))) attempts.push({ via: "ics", loaded: await loadIcs(source) });

  const winner = attempts.find(({ loaded }) => hasEvents(loaded));
  if (winner && "events" in winner.loaded) {
    const events = winner.loaded.events.filter((event) => isInWindow(event, window, nowMs));
    const status: EventSourceStatus = {
      source,
      status: "ok",
      via: winner.via,
      eventCount: events.length,
      withImageCount: events.filter((event) => event.image).length,
    };
    return { status, events };
  }

  const errors = attempts.flatMap(({ via, loaded }) => ("error" in loaded ? [`${via.toUpperCase()}: ${loaded.error}`] : []));
  const failed = errors.length === attempts.length;
  return {
    status: {
      source,
      status: failed ? "error" : "sin-eventos",
      via: null,
      eventCount: 0,
      withImageCount: 0,
      message: errors.length > 0 ? errors.join(" · ") : undefined,
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
