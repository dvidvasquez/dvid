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
