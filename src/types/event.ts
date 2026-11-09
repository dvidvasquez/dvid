export type EventCategory =
  | "punk"
  | "metal"
  | "rock"
  | "electronica"
  | "urbano"
  | "musica"
  | "teatro"
  | "feria"
  | "otro";

/** Un evento de la agenda, ya normalizado. Solo datos simples: viaja del servidor al cliente. */
export type AgendaEvent = {
  id: string;
  title: string;
  category: EventCategory;
  /** Inicio en ISO 8601 (UTC). */
  start: string;
  /** Fin en ISO 8601 (UTC); `null` si la fuente no lo trae. */
  end: string | null;
  /** Dura el dia completo (sin hora de inicio). */
  allDay: boolean;
  venue: string;
  municipality: string | null;
  /** En pesos. `0` es gratis; `null` es que la fuente no lo dice. */
  price: number | null;
  /** URL https de la imagen del evento; `null` si no hay (se usa la portada por defecto). */
  image: string | null;
  excerpt: string;
  /** Nombre de la fuente (p. ej. "Medellín Guru"). */
  source: string;
  /** Pagina del evento en la fuente. */
  url: string;
};

/** Rango de dias, ambos incluidos, como `YYYY-MM-DD` en hora de Colombia. */
export type DayRange = { from: string; to: string };

/** Un evento en un dia concreto: los que duran varios dias aparecen una vez por dia. */
export type EventOccurrence = {
  event: AgendaEvent;
  /** `YYYY-MM-DD` en hora de Colombia. */
  dayKey: string;
  /** Dia dentro del evento, desde 1. */
  dayNumber: number;
  /** Cuantos dias dura el evento. */
  dayCount: number;
};

export type EventDayGroup = {
  dayKey: string;
  occurrences: EventOccurrence[];
};
