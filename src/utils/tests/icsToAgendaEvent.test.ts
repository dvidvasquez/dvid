import assert from "node:assert/strict";
import test from "node:test";
import { icsToAgendaEvent } from "../icsToAgendaEvent";
import { parseIcs, type IcsEvent } from "../parseIcs";
import { MEDELLIN_GURU_ICS } from "./fixtures/medellinGuruIcs";

const SOURCE = { nombre: "Medellín Guru", url: "https://medellinguru.com" };

function ics(overrides: Partial<IcsEvent> = {}): IcsEvent {
  return {
    uid: "u1",
    summary: "Concierto",
    description: "",
    location: "",
    url: "https://medellinguru.com/event/concierto/",
    categories: [],
    image: null,
    start: { value: "2025-08-23T20:00", timeZone: "America/Bogota", utc: false, dateOnly: false },
    end: null,
    ...overrides,
  };
}

test("convierte el primer evento real de Medellin Guru", () => {
  const [first] = parseIcs(MEDELLIN_GURU_ICS);
  assert.deepEqual(icsToAgendaEvent(first, SOURCE), {
    id: "99003-1755936000-1756054800@medellinguru.com",
    title: "Pianotón 2025 - Classic Music Concert",
    category: "musica",
    start: "2025-08-23T13:00:00.000Z",
    end: "2025-08-24T22:00:00.000Z",
    allDay: false,
    venue: "Academia Musicreando",
    municipality: "Medellín",
    price: null,
    image: "https://medellinguru.com/wp-content/uploads/2025/08/9.-Pianoton-2025.webp",
    excerpt: "Dos días de música clásica al piano. Entrada libre hasta completar aforo, con registro previo.",
    source: "Medellín Guru",
    url: "https://medellinguru.com/event/pianoton/",
  });
});

test("convierte el segundo: sitio privado y noche que cruza a UTC del dia siguiente", () => {
  const second = icsToAgendaEvent(parseIcs(MEDELLIN_GURU_ICS)[1], SOURCE);
  assert.equal(second?.venue, "La Pascasia");
  assert.equal(second?.start, "2025-08-23T23:00:00.000Z");
  assert.equal(second?.end, "2025-08-24T04:00:00.000Z");
  assert.equal(second?.excerpt, "");
});

test("sin titulo o sin inicio no hay evento", () => {
  assert.equal(icsToAgendaEvent(ics({ summary: "" }), SOURCE), null);
  assert.equal(icsToAgendaEvent(ics({ start: null }), SOURCE), null);
});

test("un dia completo queda marcado y empieza a medianoche de Colombia", () => {
  const event = icsToAgendaEvent(
    ics({ start: { value: "2025-08-30", timeZone: null, utc: false, dateOnly: true } }),
    SOURCE,
  );
  assert.equal(event?.allDay, true);
  assert.equal(event?.start, "2025-08-30T05:00:00.000Z");
});

test("si la URL del evento no es https usa la del sitio", () => {
  assert.equal(icsToAgendaEvent(ics({ url: "http://medellinguru.com/x" }), SOURCE)?.url, "https://medellinguru.com");
});

test("descarta imagenes que no son https", () => {
  assert.equal(icsToAgendaEvent(ics({ image: "http://example.com/a.jpg" }), SOURCE)?.image, null);
});

test("un fin anterior al inicio se descarta", () => {
  const end = { value: "2025-08-23T18:00", timeZone: "America/Bogota", utc: false, dateOnly: false };
  assert.equal(icsToAgendaEvent(ics({ end }), SOURCE)?.end, null);
});

test("sin uid usa la URL como id", () => {
  assert.equal(icsToAgendaEvent(ics({ uid: "" }), SOURCE)?.id, "https://medellinguru.com/event/concierto/");
});
