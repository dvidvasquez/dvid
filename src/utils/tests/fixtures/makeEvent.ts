import type { AgendaEvent } from "@/types/event";

/** Evento de prueba: 8 nov 2026, 6 p. m. en Medellin (23:00 UTC). */
export function makeEvent(overrides: Partial<AgendaEvent> = {}): AgendaEvent {
  return {
    id: "e1",
    title: "Evento",
    category: "musica",
    start: "2026-11-08T23:00:00.000Z",
    end: null,
    allDay: false,
    venue: "Sala",
    municipality: "Medellín",
    price: null,
    image: null,
    excerpt: "",
    source: "Prueba",
    url: "https://example.com/e1",
    ...overrides,
  };
}
