import type { EventCategory } from "@/types/event";

export const EVENTS_TIME_ZONE = "America/Bogota";

/** Colombia no tiene horario de verano: siempre es UTC-5. */
export const EVENTS_UTC_OFFSET_MINUTES = -300;

/** Cuantos dias hacia adelante se piden a cada fuente. */
export const EVENTS_WINDOW_DAYS = 60;

/** Duracion supuesta si la fuente no trae fin: sirve para ocultar lo que ya paso hoy. */
export const DEFAULT_EVENT_DURATION_HOURS = 3;

/** Tope de dias que un mismo evento se repite en la agenda. */
export const MAX_EVENT_SPAN_DAYS = 14;

export const EVENT_EXCERPT_LENGTH = 200;

/** Municipios que cubre la agenda: Valle de Aburrá y los cercanos del Oriente y el Occidente. Sin tildes ni mayusculas. */
export const AGENDA_ZONE_PLACES: ReadonlyArray<string> = [
  "medellin", "bello", "itagui", "envigado", "sabaneta", "la estrella", "caldas", "copacabana", "girardota", "barbosa",
  "rionegro", "la ceja", "el retiro", "guarne", "marinilla", "carmen de viboral", "el santuario", "guatape", "el penol",
  "san vicente", "santa fe de antioquia", "san jeronimo", "sopetran", "san pedro de los milagros", "santa elena", "antioquia",
];

/** Otras ciudades con muchos eventos en las mismas fuentes: lo que pase alla no entra en la agenda. Sin tildes ni mayusculas. */
export const OUT_OF_ZONE_PLACES: ReadonlyArray<string> = [
  "bogota", "cali", "barranquilla", "cartagena", "bucaramanga", "pereira", "manizales", "armenia", "santa marta", "cucuta",
  "ibague", "villavicencio", "neiva", "pasto", "popayan", "tunja", "monteria", "valledupar", "sincelejo", "riohacha",
  "soacha", "chia", "zipaquira", "palmira", "floridablanca", "san andres", "cundinamarca", "valle del cauca", "atlantico",
  "bolivar", "santander", "risaralda", "quindio", "tolima", "boyaca", "narino", "huila", "meta", "magdalena",
  "miami", "new york", "madrid", "barcelona", "ciudad de mexico", "buenos aires", "lima", "quito", "panama", "santiago de chile",
];

/** Clave de `localStorage` con los eventos guardados (una lista JSON de eventos). */
export const SAVED_EVENTS_STORAGE_KEY = "agenda:guardados";

/** Tope de eventos guardados: el almacenamiento del navegador es pequeno. */
export const MAX_SAVED_EVENTS = 200;

/** Portada cuando el evento no trae imagen (o no carga). */
export const EVENT_DEFAULT_COVER = "/defaults/events.svg";

/** En el orden en que aparecen en los filtros. */
export const EVENT_CATEGORIES: ReadonlyArray<{ id: EventCategory; label: string }> = [
  { id: "punk", label: "Punk" },
  { id: "metal", label: "Metal" },
  { id: "rock", label: "Rock" },
  { id: "electronica", label: "Electrónica" },
  { id: "urbano", label: "Urbano" },
  { id: "musica", label: "Música" },
  { id: "teatro", label: "Teatro" },
  { id: "feria", label: "Ferias y festivales" },
  { id: "otro", label: "Otros" },
];

export type QuickRangeId = "today" | "tomorrow" | "weekend" | "week" | "month";

export const QUICK_RANGES: ReadonlyArray<{ value: QuickRangeId; label: string }> = [
  { value: "today", label: "Hoy" },
  { value: "tomorrow", label: "Mañana" },
  { value: "weekend", label: "Fin de semana" },
  { value: "week", label: "7 días" },
  { value: "month", label: "30 días" },
];
