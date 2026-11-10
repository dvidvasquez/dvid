import assert from "node:assert/strict";
import test from "node:test";
import { mergeSavedEvents } from "../mergeSavedEvents";
import { makeEvent } from "./fixtures/makeEvent";

test("sin guardados devuelve la agenda igual", () => {
  const events = [makeEvent({ id: "a", title: "Uno" })];
  assert.deepEqual(mergeSavedEvents(events, []), events);
});

test("suma en orden de inicio el guardado que la agenda ya no trae", () => {
  const first = makeEvent({ id: "a", title: "Uno", start: "2026-11-12T23:00:00.000Z" });
  const last = makeEvent({ id: "c", title: "Tres", start: "2026-11-20T23:00:00.000Z" });
  const saved = makeEvent({ id: "b", title: "Dos", start: "2026-11-15T23:00:00.000Z" });
  assert.deepEqual(mergeSavedEvents([first, last], [saved]).map(({ id }) => id), ["a", "b", "c"]);
});

test("si el evento sigue en la agenda se queda la version de la agenda", () => {
  const fresh = makeEvent({ id: "nuevo", title: "Noche Punk", venue: "Sala nueva" });
  const saved = makeEvent({ id: "viejo", title: "Noche punk", venue: "Sala vieja" });
  assert.deepEqual(mergeSavedEvents([fresh], [saved]), [fresh]);
});

test("no repite un guardado que aparece dos veces", () => {
  const saved = makeEvent({ id: "b", title: "Dos" });
  assert.equal(mergeSavedEvents([], [saved, { ...saved, id: "b2" }]).length, 1);
});
