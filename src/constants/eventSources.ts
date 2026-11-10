import type { EventCategory } from "@/types/event";

/** Una pagina HTML con eventos y, si todo lo que lista es de un genero, la categoria a usar. */
export type JsonLdPage = {
  /** Si lleva `{month}` y `months`, se lee una pagina por mes (`YYYY-MM`) desde el mes actual. */
  url: string;
  categoryHint?: EventCategory;
  /** Cuantos meses leer cuando `url` trae `{month}`. */
  months?: number;
};

/** Por donde se leyo una fuente: API REST, exportacion iCal o datos estructurados de la pagina (JSON-LD o microdatos). */
export type EventSourceVia = "rest" | "ics" | "jsonld";

export const EVENT_SOURCE_VIA_LABELS: Record<EventSourceVia, string> = {
  rest: "API",
  ics: "iCal",
  jsonld: "Página",
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
      /** Paginas con datos estructurados de eventos (schema.org en JSON-LD o microdatos), sin necesidad de API. */
      kind: "jsonld";
      pages: JsonLdPage[];
    };

const SONGKICK_MEDELLIN = "https://www.songkick.com/metro-areas/28331-colombia-medellin";
const EVENTBRITE_MEDELLIN = "https://www.eventbrite.com/d/colombia--medell%C3%ADn";
const ALLEVENTS_MEDELLIN = "https://allevents.in/medellin";
const INFOLOCAL_AGENDA = "https://infolocal.comfenalcoantioquia.com/index.php/agenda";

/**
 * Las fuentes se revisan en el panel «Fuentes» de /agenda. Se sacaron las que desde el servidor
 * respondian 403 (bloquean trafico automatico: Medellín Guru, Bandsintown, JamBase, Eventworld,
 * Medellín.co, Cartel Rock), 429 (Vamos Eventos) o no traian datos de eventos (Fever, Medellín
 * Vibra y las paginas de Teatro Metropolitano, Matacandelas y La Tiquetera: sin JSON-LD ni
 * microdatos), 500 (Qué Pasa Hoy) o solo traian la ficha del sitio (Kalender). Los teatros salen
 * por Infolocal y Descubre Medellín; las universidades por el Teatro Universidad de Medellín y el
 * calendario de EAFIT. Quedan fuera las que solo publican PDF, imagenes o redes sociales (casas de
 * cultura, UdeA, UNAL) y los eventos de medellin.gov.co (robots.txt no permite leerlos).
 * Las tiqueteras no ofrecen API publica: La Tiquetera se esta cerrando (migra a Ticketmaster) y
 * los listados por recinto de Tuboleta se arman en el navegador (el HTML llega sin eventos).
 * Tambien salieron Medellín Travel (su vista mensual responde 404) y el Jardín Botánico (su agenda
 * llega sin eventos en el HTML).
 * Si una pagina no trae JSON-LD ni microdatos se lee el JSON embebido o las tarjetas con <time>.
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
    nombre: "AllEvents",
    url: ALLEVENTS_MEDELLIN,
    kind: "jsonld",
    pages: [
      { url: ALLEVENTS_MEDELLIN },
      { url: `${ALLEVENTS_MEDELLIN}/music`, categoryHint: "musica" },
      { url: `${ALLEVENTS_MEDELLIN}/performing-arts`, categoryHint: "teatro" },
      { url: `${ALLEVENTS_MEDELLIN}/nightlife` },
      { url: `${ALLEVENTS_MEDELLIN}/festivals`, categoryHint: "feria" },
    ],
  },
  {
    nombre: "Descubre Medellín",
    url: "https://descubremedellin.co/es/agenda/",
    kind: "jsonld",
    pages: [{ url: "https://descubremedellin.co/es/agenda/" }],
  },
  {
    // Teatro Prado, Pablo Tobon, Pequeño Teatro, Casa Clown...: eventos en microdatos, 21 por pagina.
    nombre: "Infolocal Comfenalco",
    url: INFOLOCAL_AGENDA,
    kind: "jsonld",
    pages: [
      { url: INFOLOCAL_AGENDA },
      { url: `${INFOLOCAL_AGENDA}?controller=search&orderBy=start_date%20asc&start=21` },
      { url: `${INFOLOCAL_AGENDA}?controller=search&orderBy=start_date%20asc&start=42` },
    ],
  },
  {
    // Teatro de la Universidad de Medellín (1.700 sillas): conciertos, stand-up y sinfónicos. Calendario con eventos en JSON.
    nombre: "Teatro Universidad de Medellín",
    url: "https://teatro.udemedellin.edu.co/eventos/",
    kind: "jsonld",
    pages: [
      { url: "https://teatro.udemedellin.edu.co/eventos/" },
      { url: "https://teatro.udemedellin.edu.co/mec-category/eventos-universidad/" },
    ],
  },
  {
    // Techno y electrónica en Medellín (Freedom, Vimukti, Blackdance...): 19 entradas con imagen. A probar: el panel dirá si trae JSON-LD.
    nombre: "Medellín Style",
    url: "https://www.medellinstyle.com/eventos",
    kind: "jsonld",
    pages: [{ url: "https://www.medellinstyle.com/eventos", categoryHint: "electronica" }],
  },
  {
    // Charlas, observaciones, shows del domo y conciertos gratis. El Planetario lo opera Parque Explora y su agenda sale en las dos webs.
    nombre: "Parque Explora y Planetario",
    url: "https://www.parqueexplora.org/programate",
    kind: "jsonld",
    pages: [
      { url: "https://www.parqueexplora.org/programate" },
      { url: "https://www.planetariomedellin.org/agenda-cultural" },
    ],
  },
  {
    // Noches de club en Medellín (Salón Amador, Rama Soundgarden, Ministry Club, Xero, Sonorama) y festivales. A probar.
    nombre: "Techno Airlines",
    url: "https://www.technoairlines.com/events/medellin",
    kind: "jsonld",
    pages: [{ url: "https://www.technoairlines.com/events/medellin", categoryHint: "electronica" }],
  },
  {
    // Orquesta Sinfónica, cine, teatro y exposiciones de EAFIT abiertos al público. Calendario de Drupal: los eventos van como texto JSON en `calendar_options`.
    nombre: "EAFIT",
    url: "https://www.eafit.edu.co/calendario-eventos",
    kind: "jsonld",
    pages: [{ url: "https://www.eafit.edu.co/calendario-eventos" }],
  },
];
