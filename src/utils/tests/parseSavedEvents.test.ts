import assert from "node:assert/strict";
import test from "node:test";
import { parseSavedEvents } from "../parseSavedEvents";
import { makeEvent } from "./fixtures/makeEvent";

test("devuelve los eventos tal como se guardaron", () => {
  const events = [makeEvent({ id: "a", image: "https://example.com/a.jpg", price: 0 }), makeEvent({ id: "b", title: "Otro" })];
  assert.deepEqual(parseSavedEvents(JSON.stringify(events)), events);
});

test("texto vacio, JSON roto o algo que no es una lista dan una lista vacia", () => {
  assert.deepEqual(parseSavedEvents(""), []);
  assert.deepEqual(parseSavedEvents("{roto"), []);
  assert.deepEqual(parseSavedEvents('{"id":"a"}'), []);
});

test("descarta lo que no tiene id, titulo, fecha valida o enlace https", () => {
  const good = makeEvent({ id: "ok" });
  const stored = [
    good,
    { ...good, id: "" },
    { ...good, title: 5 },
    { ...good, start: "mañana" },
    { ...good, url: "javascript:alert(1)" },
    null,
    "texto",
  ];
  assert.deepEqual(parseSavedEvents(JSON.stringify(stored)).map(({ id }) => id), ["ok"]);
});

test("limpia los campos opcionales que vienen mal", () => {
  const stored = [{ ...makeEvent({ id: "a" }), category: "salsa", price: "gratis", image: "http://inseguro/a.jpg", end: "nunca", municipality: "", allDay: "si" }];
  const [event] = parseSavedEvents(JSON.stringify(stored));
  assert.equal(event.category, "otro");
  assert.equal(event.price, null);
  assert.equal(event.image, null);
  assert.equal(event.end, null);
  assert.equal(event.municipality, null);
  assert.equal(event.allDay, false);
});
