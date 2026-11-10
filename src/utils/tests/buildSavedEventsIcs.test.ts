import assert from "node:assert/strict";
import test from "node:test";
import { buildSavedEventsIcs } from "../buildSavedEventsIcs";
import { icsToAgendaEvent } from "../icsToAgendaEvent";
import { parseIcs } from "../parseIcs";
import { makeEvent } from "./fixtures/makeEvent";

const NOW = Date.parse("2026-11-08T12:00:00.000Z");
const lines = (ics: string) => ics.split("\r\n");

test("sin guardados da un calendario vacio y valido", () => {
  const ics = buildSavedEventsIcs([], NOW);
  assert.equal(lines(ics)[0], "BEGIN:VCALENDAR");
  assert.ok(ics.endsWith("END:VCALENDAR\r\n"));
  assert.ok(!ics.includes("BEGIN:VEVENT"));
});

test("un evento con hora sale con inicio en UTC y, sin fin, dura lo supuesto", () => {
  const event = makeEvent({ title: "Noche Punk", venue: "Sala", municipality: "Medellín", url: "https://example.com/punk" });
  const ics = lines(buildSavedEventsIcs([{ event, dayKey: "2026-11-08" }], NOW));
  assert.ok(ics.includes("DTSTART:20261108T230000Z"));
  assert.ok(ics.includes("DTEND:20261109T020000Z"));
  assert.ok(ics.includes("SUMMARY:Noche Punk"));
  assert.ok(ics.includes("LOCATION:Sala\\, Medellín"));
  assert.ok(ics.includes("URL:https://example.com/punk"));
  assert.ok(ics.includes("DTSTAMP:20261108T120000Z"));
});

test("usa el fin del evento si es el mismo dia", () => {
  const event = makeEvent({ end: "2026-11-09T01:00:00.000Z" });
  assert.ok(lines(buildSavedEventsIcs([{ event, dayKey: "2026-11-08" }], NOW)).includes("DTEND:20261109T010000Z"));
});

test("otro dia de un evento largo, o un evento sin hora, va como dia completo", () => {
  const fair = makeEvent({ title: "Feria", end: "2026-11-12T23:00:00.000Z" });
  const ics = lines(buildSavedEventsIcs([{ event: fair, dayKey: "2026-11-10" }], NOW));
  assert.ok(ics.includes("DTSTART;VALUE=DATE:20261110"));
  assert.ok(ics.includes("DTEND;VALUE=DATE:20261111"));

  const allDay = makeEvent({ allDay: true, start: "2026-11-30T05:00:00.000Z" });
  const other = lines(buildSavedEventsIcs([{ event: allDay, dayKey: "2026-11-30" }], NOW));
  assert.ok(other.includes("DTSTART;VALUE=DATE:20261130"));
  assert.ok(other.includes("DTEND;VALUE=DATE:20261201"));
});

test("cada dia guardado del mismo evento tiene su propio UID", () => {
  const fair = makeEvent({ title: "Feria", end: "2026-11-12T23:00:00.000Z" });
  const ics = buildSavedEventsIcs([{ event: fair, dayKey: "2026-11-09" }, { event: fair, dayKey: "2026-11-10" }], NOW);
  const uids = lines(ics).filter((line) => line.startsWith("UID:"));
  assert.equal(new Set(uids).size, 2);
});

test("escapa comas, punto y coma y saltos, y parte las lineas largas", () => {
  const event = makeEvent({ title: "Rock; metal, punk", excerpt: `${"palabra ".repeat(30)}\nfin` });
  const ics = buildSavedEventsIcs([{ event, dayKey: "2026-11-08" }], NOW);
  assert.ok(ics.includes("SUMMARY:Rock\\; metal\\, punk"));
  assert.ok(lines(ics).every((line) => line.length <= 75));
  assert.ok(ics.includes("\r\n "));
});

test("lo que se exporta se puede volver a leer con el lector de iCal del proyecto", () => {
  const event = makeEvent({ title: "Jazz, en vivo", venue: "Club del Jazz", url: "https://example.com/jazz" });
  const [parsed] = parseIcs(buildSavedEventsIcs([{ event, dayKey: "2026-11-08" }], NOW));
  const back = icsToAgendaEvent(parsed, { nombre: "Prueba", url: "https://example.com" });
  assert.equal(back?.title, "Jazz, en vivo");
  assert.equal(back?.start, event.start);
  assert.equal(back?.url, "https://example.com/jazz");
});
