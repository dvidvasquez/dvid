import assert from "node:assert/strict";
import test from "node:test";
import { parseIcs } from "../parseIcs";
import { MEDELLIN_GURU_ICS } from "./fixtures/medellinGuruIcs";

test("lee los eventos de la exportacion de Medellin Guru", () => {
  const events = parseIcs(MEDELLIN_GURU_ICS);
  assert.equal(events.length, 2);

  const [first, second] = events;
  assert.equal(first.uid, "99003-1755936000-1756054800@medellinguru.com");
  assert.equal(first.summary, "Pianotón 2025 - Classic Music Concert");
  assert.equal(first.url, "https://medellinguru.com/event/pianoton/");
  assert.deepEqual(first.categories, ["Concerts", "Culture", "Music festivals", "Musical"]);
  assert.equal(second.summary, "Heaven and Hell Symphony Fest");
});

test("la zona horaria y la fecha quedan sin convertir", () => {
  const [first] = parseIcs(MEDELLIN_GURU_ICS);
  assert.deepEqual(first.start, { value: "2025-08-23T08:00", timeZone: "America/Bogota", utc: false, dateOnly: false });
  assert.deepEqual(first.end, { value: "2025-08-24T17:00", timeZone: "America/Bogota", utc: false, dateOnly: false });
});

test("quita los escapes de coma y salto de linea", () => {
  const [first] = parseIcs(MEDELLIN_GURU_ICS);
  assert.equal(first.location, "Academia Musicreando, Carrera 10 #12-130, Medellín, Antioquia, Colombia");
  assert.equal(first.description, "Dos días de música clásica al piano.\nEntrada libre hasta completar aforo, con registro previo.");
});

test("une las lineas plegadas y toma la imagen de ATTACH", () => {
  const [first, second] = parseIcs(MEDELLIN_GURU_ICS);
  assert.equal(first.image, "https://medellinguru.com/wp-content/uploads/2025/08/9.-Pianoton-2025.webp");
  assert.equal(second.image, "https://medellinguru.com/wp-content/uploads/2025/08/17.-Heaven-and-Hell-Symphony-Fest.webp");
});

test("un evento de dia completo trae solo la fecha", () => {
  const ics = ["BEGIN:VCALENDAR", "BEGIN:VEVENT", "DTSTART;VALUE=DATE:20250830", "SUMMARY:Feria", "END:VEVENT", "END:VCALENDAR"].join("\n");
  const [event] = parseIcs(ics);
  assert.deepEqual(event.start, { value: "2025-08-30", timeZone: null, utc: false, dateOnly: true });
  assert.equal(event.end, null);
});

test("la hora con Z esta en UTC y no lleva zona", () => {
  const ics = ["BEGIN:VEVENT", "DTSTART:20250830T230000Z", "SUMMARY:Noche", "END:VEVENT"].join("\r\n");
  const [event] = parseIcs(ics);
  assert.deepEqual(event.start, { value: "2025-08-30T23:00", timeZone: null, utc: true, dateOnly: false });
});

test("ignora la descripcion de las alarmas", () => {
  const ics = [
    "BEGIN:VEVENT",
    "SUMMARY:Concierto",
    "DESCRIPTION:Detalle real",
    "BEGIN:VALARM",
    "DESCRIPTION:Recordatorio",
    "END:VALARM",
    "END:VEVENT",
  ].join("\r\n");
  const [event] = parseIcs(ics);
  assert.equal(event.description, "Detalle real");
});

test("una URL en ATTACH que no es imagen se descarta", () => {
  const ics = ["BEGIN:VEVENT", "SUMMARY:X", "ATTACH:https://example.com/programa.pdf", "END:VEVENT"].join("\r\n");
  assert.equal(parseIcs(ics)[0].image, null);
});

test("un evento sin fecha de inicio deja start en null", () => {
  const ics = ["BEGIN:VEVENT", "SUMMARY:Sin fecha", "END:VEVENT"].join("\r\n");
  assert.equal(parseIcs(ics)[0].start, null);
});

test("texto que no es iCal da una lista vacia", () => {
  assert.deepEqual(parseIcs("<html>no soy un calendario</html>"), []);
});
