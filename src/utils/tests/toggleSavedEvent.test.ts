import assert from "node:assert/strict";
import test from "node:test";
import { MAX_SAVED_EVENTS } from "@/constants/events";
import { toggleSavedEvent } from "../toggleSavedEvent";
import { makeEvent } from "./fixtures/makeEvent";

const NOW = Date.parse("2026-11-08T12:00:00.000Z");
const DAY = "2026-11-08";
const at = (event = makeEvent(), dayKey = DAY) => ({ event, dayKey });

test("guarda un evento que no estaba, al final", () => {
  const a = makeEvent({ id: "a", title: "Uno" });
  const b = makeEvent({ id: "b", title: "Dos" });
  assert.deepEqual(toggleSavedEvent([at(a)], b, DAY, NOW), [at(a), at(b)]);
});

test("quita un evento que ya estaba en ese dia", () => {
  const a = makeEvent({ id: "a", title: "Uno" });
  const b = makeEvent({ id: "b", title: "Dos" });
  assert.deepEqual(toggleSavedEvent([at(a), at(b)], a, DAY, NOW), [at(b)]);
});

test("un evento de varios dias se guarda solo en el dia marcado", () => {
  const fair = makeEvent({ id: "feria", title: "Feria", end: "2026-11-11T23:00:00.000Z" });
  const saved = toggleSavedEvent([], fair, "2026-11-10", NOW);
  assert.deepEqual(saved, [at(fair, "2026-11-10")]);
  // Marcar otro dia lo suma; no quita el primero.
  assert.deepEqual(toggleSavedEvent(saved, fair, "2026-11-09", NOW), [at(fair, "2026-11-10"), at(fair, "2026-11-09")]);
  // Quitar un dia deja los demas.
  assert.deepEqual(toggleSavedEvent([at(fair, "2026-11-09"), at(fair, "2026-11-10")], fair, "2026-11-09", NOW), [at(fair, "2026-11-10")]);
});

test("reconoce el mismo evento aunque venga de otra fuente con otro id", () => {
  const saved = makeEvent({ id: "songkick-1", title: "Noche Punk", source: "Songkick" });
  const other = makeEvent({ id: "eventbrite-9", title: "NOCHE PUNK!", source: "Eventbrite" });
  assert.deepEqual(toggleSavedEvent([at(saved)], other, DAY, NOW), []);
});

test("suelta los guardados cuyo evento termino o cuyo dia ya paso", () => {
  const old = makeEvent({ id: "old", title: "Viejo", start: "2026-11-01T23:00:00.000Z" });
  const fair = makeEvent({ id: "feria", title: "Feria", start: "2026-11-05T15:00:00.000Z", end: "2026-11-11T23:00:00.000Z" });
  const next = makeEvent({ id: "new", title: "Nuevo" });
  assert.deepEqual(toggleSavedEvent([at(old, "2026-11-01"), at(fair, "2026-11-06"), at(fair, "2026-11-10")], next, DAY, NOW), [
    at(fair, "2026-11-10"),
    at(next),
  ]);
});

test("no pasa del tope: salen los mas viejos", () => {
  const saved = Array.from({ length: MAX_SAVED_EVENTS }, (_, index) => at(makeEvent({ id: `e${index}`, title: `Evento ${index}` })));
  const result = toggleSavedEvent(saved, makeEvent({ id: "nuevo", title: "Nuevo" }), DAY, NOW);
  assert.equal(result.length, MAX_SAVED_EVENTS);
  assert.equal(result[0].event.id, "e1");
  assert.equal(result.at(-1)?.event.id, "nuevo");
});

test("no cambia la lista original", () => {
  const saved = [at(makeEvent({ id: "a", title: "Uno" }))];
  toggleSavedEvent(saved, makeEvent({ id: "b", title: "Dos" }), DAY, NOW);
  assert.equal(saved.length, 1);
});
