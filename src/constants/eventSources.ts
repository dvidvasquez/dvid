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
    };

export const EVENT_SOURCES: EventSource[] = [
  {
    nombre: "Medellín Guru",
    url: "https://medellinguru.com",
    kind: "tribe",
    restUrl: "https://medellinguru.com/wp-json/tribe/events/v1/events",
    icsUrl: "https://medellinguru.com/events/?ical=1",
  },
];
