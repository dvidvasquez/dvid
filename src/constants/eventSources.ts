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

/**
 * Las fuentes se revisan en el panel «Fuentes» de /agenda. Se quitaron las que desde el servidor
 * respondian 403 (bloquean trafico automatico: Medellín Guru, Bandsintown, JamBase, Eventworld,
 * Medellín.co), 404/410 (el calendario de Medellín Travel cambio de URL) o no traian eventos (Fever).
 * Songkick y Eventbrite son las que se confirmaron funcionando; el resto son sitios locales y
 * agendas de teatros que se prueban por JSON-LD: si el panel dice que no traen datos, se quitan o
 * se les escribe un lector propio.
 */
export const EVENT_SOURCES: EventSource[] = [
  {
    nombre: "Songkick",
    url: SONGKICK_MEDELLIN,
    kind: "jsonld",
    // La pagina 2 responde 406: Medellin cabe en una sola pagina.
    pages: [{ url: SONGKICK_MEDELLIN, categoryHint: "musica" }],
  },
  {
    nombre: "Eventbrite",
    url: `${EVENTBRITE_MEDELLIN}/events/`,
    kind: "jsonld",
    pages: [
      { url: `${EVENTBRITE_MEDELLIN}/events/` },
      { url: `${EVENTBRITE_MEDELLIN}/events/?page=2` },
      { url: `${EVENTBRITE_MEDELLIN}/events/?page=3` },
      { url: `${EVENTBRITE_MEDELLIN}/music--events/`, categoryHint: "musica" },
      { url: `${EVENTBRITE_MEDELLIN}/music--events/?page=2`, categoryHint: "musica" },
      { url: `${EVENTBRITE_MEDELLIN}/performing-arts--events/`, categoryHint: "teatro" },
      { url: `${EVENTBRITE_MEDELLIN}/community--events/`, categoryHint: "feria" },
      { url: `${EVENTBRITE_MEDELLIN}/food-and-drink--events/`, categoryHint: "feria" },
    ],
  },
  {
    nombre: "Infolocal Comfenalco",
    url: "https://infolocal.comfenalcoantioquia.com/index.php/agenda",
    kind: "jsonld",
    pages: [{ url: "https://infolocal.comfenalcoantioquia.com/index.php/agenda" }],
  },
  {
    nombre: "Medellín Travel",
    url: "https://www.medellin.travel/caleventos/",
    kind: "jsonld",
    pages: [{ url: "https://www.medellin.travel/caleventos/" }],
  },
  {
    nombre: "Descubre Medellín",
    url: "https://descubremedellin.co/es/agenda/",
    kind: "jsonld",
    pages: [{ url: "https://descubremedellin.co/es/agenda/" }],
  },
  {
    nombre: "Vamos Eventos",
    url: "https://www.vamoseventos.com/medellin",
    kind: "jsonld",
    pages: [
      { url: "https://www.vamoseventos.com/medellin" },
      { url: "https://www.vamoseventos.com/medellin/hoy" },
    ],
  },
  {
    nombre: "AllEvents",
    url: "https://allevents.in/medellin",
    kind: "jsonld",
    pages: [
      { url: "https://allevents.in/medellin" },
      { url: "https://allevents.in/medellin/music", categoryHint: "musica" },
    ],
  },
  {
    nombre: "Cartel Rock",
    url: "https://cartelrock.com/eventos",
    kind: "jsonld",
    // municipio:23 es Medellin en el filtro del sitio.
    pages: [{ url: "https://cartelrock.com/eventos?f%5B0%5D=municipio%3A23", categoryHint: "rock" }],
  },
  {
    nombre: "Medellín Vibra",
    url: "https://www.medellinvibra.co/",
    kind: "jsonld",
    pages: [{ url: "https://www.medellinvibra.co/" }],
  },
  {
    nombre: "Teatro Metropolitano",
    url: "https://www.teatrometropolitano.com/programacion/eventos",
    kind: "jsonld",
    pages: [{ url: "https://www.teatrometropolitano.com/programacion/eventos" }],
  },
  {
    nombre: "Matacandelas",
    url: "https://www.matacandelas.com/",
    kind: "jsonld",
    pages: [{ url: "https://www.matacandelas.com/" }],
  },
  {
    nombre: "La Tiquetera (Comfama)",
    url: "https://latiquetera.com/site/comfama",
    kind: "jsonld",
    pages: [{ url: "https://latiquetera.com/site/comfama" }],
  },
];
