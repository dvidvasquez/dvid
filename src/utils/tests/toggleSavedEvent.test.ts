import assert from "node:assert/strict";
import test from "node:test";
import { MAX_SAVED_EVENTS } from "@/constants/events";
import { toggleSavedEvent } from "../toggleSavedEvent";
import { makeEvent } from "./fixtures/makeEvent";

const NOW = Date.parse("2026-11-08T12:00:00.000Z");

test("guarda un evento que no estaba, al final", () => {
  const a = makeEvent({ id: "a", title: "Uno" });
  const b = makeEvent({ id: "b", title: "Dos" });
  assert.deepEqual(toggleSavedEvent([a], b, NOW), [a, b]);
});

test("quita un evento que ya estaba", () => {
  const a = makeEvent({ id: "a", title: "Uno" });
  const b = makeEvent({ id: "b", title: "Dos" });
  assert.deepEqual(toggleSavedEvent([a, b], a, NOW), [b]);
});

test("reconoce el mismo evento aunque venga de otra fuente con otro id", () => {
  const saved = makeEvent({ id: "songkick-1", title: "Noche Punk", source: "Songkick" });
  const other = makeEvent({ id: "eventbrite-9", title: "NOCHE PUNK!", source: "Eventbrite" });
  assert.deepEqual(toggleSavedEvent([saved], other, NOW), []);
});

test("suelta los guardados que ya terminaron", () => {
  const old = makeEvent({ id: "old", title: "Viejo", start: "2026-11-01T23:00:00.000Z" });
  const next = makeEvent({ id: "new", title: "Nuevo" });
  assert.deepEqual(toggleSavedEvent([old], next, NOW), [next]);
});

test("no pasa del tope: salen los mas viejos", () => {
  const saved = Array.from({ length: MAX_SAVED_EVENTS }, (_, index) => makeEvent({ id: `e${index}`, title: `Evento ${index}` }));
  const result = toggleSavedEvent(saved, makeEvent({ id: "nuevo", title: "Nuevo" }), NOW);
  assert.equal(result.length, MAX_SAVED_EVENTS);
  assert.equal(result[0].id, "e1");
  assert.equal(result.at(-1)?.id, "nuevo");
});

test("no cambia la lista original", () => {
  const saved = [makeEvent({ id: "a", title: "Uno" })];
  toggleSavedEvent(saved, makeEvent({ id: "b", title: "Dos" }), NOW);
  assert.equal(saved.length, 1);
});
