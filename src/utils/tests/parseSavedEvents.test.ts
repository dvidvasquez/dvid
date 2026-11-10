import assert from "node:assert/strict";
import test from "node:test";
import { parseSavedEvents } from "../parseSavedEvents";
import { makeEvent } from "./fixtures/makeEvent";

const saved = (event = makeEvent(), dayKey = "2026-11-08") => ({ event, dayKey });

test("devuelve los guardados tal como se guardaron", () => {
  const list = [saved(makeEvent({ id: "a", image: "https://example.com/a.jpg", price: 0 })), saved(makeEvent({ id: "b", title: "Otro" }), "2026-11-09")];
  assert.deepEqual(parseSavedEvents(JSON.stringify(list)), list);
});

test("texto vacio, JSON roto o algo que no es una lista dan una lista vacia", () => {
  assert.deepEqual(parseSavedEvents(""), []);
  assert.deepEqual(parseSavedEvents("{roto"), []);
  assert.deepEqual(parseSavedEvents('{"id":"a"}'), []);
});

test("un evento suelto (formato anterior) queda guardado en su dia de inicio", () => {
  const event = makeEvent({ id: "viejo" });
  assert.deepEqual(parseSavedEvents(JSON.stringify([event])), [{ event, dayKey: "2026-11-08" }]);
});

test("descarta lo que no tiene dia valido, id, titulo, fecha valida o enlace https", () => {
  const good = makeEvent({ id: "ok" });
  const stored = [
    saved(good),
    saved(good, "8 de noviembre"),
    { event: good },
    saved({ ...good, id: "" }),
    saved({ ...good, title: 5 as unknown as string }),
    saved({ ...good, start: "mañana" }),
    saved({ ...good, url: "javascript:alert(1)" }),
    null,
    "texto",
  ];
  assert.deepEqual(parseSavedEvents(JSON.stringify(stored)).map(({ event }) => event.id), ["ok"]);
});

test("limpia los campos opcionales que vienen mal", () => {
  const stored = [{ dayKey: "2026-11-08", event: { ...makeEvent({ id: "a" }), category: "salsa", price: "gratis", image: "http://inseguro/a.jpg", end: "nunca", municipality: "", allDay: "si" } }];
  const [{ event }] = parseSavedEvents(JSON.stringify(stored));
  assert.equal(event.category, "otro");
  assert.equal(event.price, null);
  assert.equal(event.image, null);
  assert.equal(event.end, null);
  assert.equal(event.municipality, null);
  assert.equal(event.allDay, false);
});
