import assert from "node:assert/strict";
import test from "node:test";
import { groupEventsByDay } from "../groupEventsByDay";
import { makeEvent } from "./fixtures/makeEvent";

// 8 nov 2026, 10 a. m. en Medellin.
const NOW = Date.parse("2026-11-08T15:00:00.000Z");
const RANGE = { from: "2026-11-08", to: "2026-11-09" };

test("agrupa por dia y ordena por hora", () => {
  const late = makeEvent({ id: "late", start: "2026-11-09T01:00:00.000Z" }); // 8 p. m. del 8
  const early = makeEvent({ id: "early", start: "2026-11-08T21:00:00.000Z" }); // 4 p. m. del 8
  const next = makeEvent({ id: "next", start: "2026-11-10T00:00:00.000Z" }); // 7 p. m. del 9

  const groups = groupEventsByDay([late, next, early], RANGE, NOW);
  assert.deepEqual(
    groups.map((group) => [group.dayKey, group.occurrences.map(({ event }) => event.id)]),
    [
      ["2026-11-08", ["early", "late"]],
      ["2026-11-09", ["next"]],
    ],
  );
});

test("deja fuera lo que cae fuera del rango", () => {
  const outside = makeEvent({ id: "outside", start: "2026-11-12T23:00:00.000Z" });
  assert.deepEqual(groupEventsByDay([outside], RANGE, NOW), []);
});

test("oculta de hoy lo que ya termino", () => {
  const done = makeEvent({ id: "done", start: "2026-11-08T11:00:00.000Z" }); // 6 a. m., acabo a las 9 a. m.
  const upcoming = makeEvent({ id: "upcoming" });
  const [today] = groupEventsByDay([done, upcoming], RANGE, NOW);
  assert.deepEqual(today.occurrences.map(({ event }) => event.id), ["upcoming"]);
});

test("un evento de varios dias sale en cada dia con su numero", () => {
  const long = makeEvent({ id: "long", start: "2026-11-07T23:00:00.000Z", end: "2026-11-09T23:00:00.000Z" });
  const groups = groupEventsByDay([long], RANGE, NOW);
  assert.deepEqual(
    groups.map(({ dayKey, occurrences }) => [dayKey, occurrences[0].dayNumber, occurrences[0].dayCount]),
    [
      ["2026-11-08", 2, 3],
      ["2026-11-09", 3, 3],
    ],
  );
});

test("sin eventos no hay grupos", () => {
  assert.deepEqual(groupEventsByDay([], RANGE, NOW), []);
});
