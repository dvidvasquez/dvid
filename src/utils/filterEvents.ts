import { EVENT_CATEGORIES } from "@/constants/events";
import type { AgendaEvent, EventCategory } from "@/types/event";
import { foldText } from "./foldText";

export type EventFilters = {
  /** Vacio = todas las categorias. */
  categories: EventCategory[];
  /** Vacio = todos los municipios. */
  municipality: string;
  freeOnly: boolean;
  query: string;
};

export const NO_EVENT_FILTERS: EventFilters = { categories: [], municipality: "", freeOnly: false, query: "" };

const CATEGORY_LABELS = new Map(EVENT_CATEGORIES.map(({ id, label }) => [id, label]));

/** Filtra por categoria, municipio, gratis y texto (titulo, sitio, municipio y categoria; sin tildes). */
export function filterEvents(events: AgendaEvent[], filters: EventFilters): AgendaEvent[] {
  const municipality = foldText(filters.municipality);
  const terms = foldText(filters.query).split(/\s+/).filter(Boolean);

  return events.filter((event) => {
    if (filters.categories.length > 0 && !filters.categories.includes(event.category)) return false;
    if (municipality && foldText(event.municipality ?? "") !== municipality) return false;
    if (filters.freeOnly && event.price !== 0) return false;
    if (terms.length === 0) return true;

    const haystack = foldText(
      [event.title, event.venue, event.municipality, CATEGORY_LABELS.get(event.category)].filter(Boolean).join(" "),
    );
    return terms.every((term) => haystack.includes(term));
  });
}
