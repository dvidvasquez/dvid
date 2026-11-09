import type { EventCategory } from "@/types/event";

/** Una pagina HTML con eventos y, si todo lo que lista es de un genero, la categoria a usar. */
export type JsonLdPage = {
  url: string;
  categoryHint?: EventCategory;
};

/** Por donde se leyo una fuente: API REST, exportacion iCal o datos estructurados de la pagina. */
export type EventSourceVia = "rest" | "ics" | "jsonld";

export const EVENT_SOURCE_VIA_LABELS: Record<EventSourceVia, string> = {
  rest: "API",
  ics: "iCal",
  jsonld: "JSON-LD",
};

export type EventSource =
  | {
      nombre: string;
      /** Sitio principal. */
      url: string;
      /** WordPress con The Events Calendar: API REST y, si falla, exportacion iCal. */
      kind: "tribe";
      restUrl: string;
      icsUrl: string;
    }
  | {
      nombre: string;
      url: string;
      /** Cualquier calendario iCal publico (.ics). */
      kind: "ics";
      icsUrl: string;
    }
  | {
      nombre: string;
      url: string;
      /** Paginas con datos estructurados de eventos (schema.org, JSON-LD), sin necesidad de API. */
      kind: "jsonld";
      pages: JsonLdPage[];
    };

const SONGKICK_MEDELLIN = "https://www.songkick.com/metro-areas/28331-colombia-medellin";
const EVENTBRITE_MEDELLIN = "https://www.eventbrite.com/d/colombia--medell%C3%ADn";
const EVENTWORLD_MEDELLIN = "https://www.eventworld.com/medellin/concerts";

export const EVENT_SOURCES: EventSource[] = [
  {
    nombre: "Medellín Guru",
    url: "https://medellinguru.com",
    kind: "tribe",
    restUrl: "https://medellinguru.com/wp-json/tribe/events/v1/events",
    icsUrl: "https://medellinguru.com/events/?ical=1",
  },
  {
    nombre: "Medellín Travel",
    url: "https://www.medellin.travel/eventos/",
    kind: "tribe",
    restUrl: "https://www.medellin.travel/wp-json/tribe/events/v1/events",
    icsUrl: "https://www.medellin.travel/eventos/?ical=1",
  },
  {
    nombre: "Songkick",
    url: SONGKICK_MEDELLIN,
    kind: "jsonld",
    pages: [
      { url: SONGKICK_MEDELLIN, categoryHint: "musica" },
      { url: `${SONGKICK_MEDELLIN}?page=2`, categoryHint: "musica" },
    ],
  },
  {
    nombre: "Eventbrite",
    url: `${EVENTBRITE_MEDELLIN}/events/`,
    kind: "jsonld",
    pages: [
      { url: `${EVENTBRITE_MEDELLIN}/events/` },
      { url: `${EVENTBRITE_MEDELLIN}/music--events/`, categoryHint: "musica" },
      { url: `${EVENTBRITE_MEDELLIN}/performing-arts--events/`, categoryHint: "teatro" },
      { url: `${EVENTBRITE_MEDELLIN}/food-and-drink--events/`, categoryHint: "feria" },
    ],
  },
  {
    nombre: "Bandsintown",
    url: "https://www.bandsintown.com/c/medellin-colombia",
    kind: "jsonld",
    pages: [
      { url: "https://www.bandsintown.com/c/medellin-colombia", categoryHint: "musica" },
      { url: "https://www.bandsintown.com/c/medellin-colombia/all-dates/genre/electronic", categoryHint: "electronica" },
    ],
  },
  {
    nombre: "JamBase",
    url: "https://www.jambase.com/concerts/co/~/concerts-in-medellin",
    kind: "jsonld",
    pages: [{ url: "https://www.jambase.com/concerts/co/~/concerts-in-medellin", categoryHint: "musica" }],
  },
  {
    nombre: "Eventworld",
    url: EVENTWORLD_MEDELLIN,
    kind: "jsonld",
    pages: [
      { url: `${EVENTWORLD_MEDELLIN}/metal`, categoryHint: "metal" },
      { url: `${EVENTWORLD_MEDELLIN}/rock`, categoryHint: "rock" },
      { url: `${EVENTWORLD_MEDELLIN}/indie`, categoryHint: "rock" },
    ],
  },
  {
    nombre: "Fever",
    url: "https://feverup.com/es/medellin",
    kind: "jsonld",
    pages: [{ url: "https://feverup.com/es/medellin" }],
  },
  {
    nombre: "Medellín.co",
    url: "https://medellin.co/events-categories/concert",
    kind: "jsonld",
    pages: [{ url: "https://medellin.co/events-categories/concert", categoryHint: "musica" }],
  },
];
