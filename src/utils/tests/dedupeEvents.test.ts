import assert from "node:assert/strict";
import test from "node:test";
import { dedupeEvents } from "../dedupeEvents";
import { makeEvent } from "./fixtures/makeEvent";

test("deja pasar los eventos distintos en su orden", () => {
  const events = [makeEvent({ id: "a", title: "Uno" }), makeEvent({ id: "b", title: "Dos" })];
  assert.deepEqual(dedupeEvents(events).map(({ id }) => id), ["a", "b"]);
});

test("junta el mismo titulo el mismo dia sin importar tildes, signos ni mayusculas", () => {
  const events = [
    makeEvent({ id: "a", title: "Festival de la Empanada" }),
    makeEvent({ id: "b", title: "FESTIVAL DE LA EMPANADA!" }),
  ];
  assert.equal(dedupeEvents(events).length, 1);
});

test("el mismo titulo en otro dia es otro evento", () => {
  const events = [
    makeEvent({ id: "a", title: "Noche Punk" }),
    makeEvent({ id: "b", title: "Noche Punk", start: "2026-11-15T23:00:00.000Z" }),
  ];
  assert.equal(dedupeEvents(events).length, 2);
});

test("entre repetidos se queda con el que trae imagen", () => {
  const events = [
    makeEvent({ id: "sin", title: "Noche Punk", excerpt: "Texto largo de la descripcion" }),
    makeEvent({ id: "con", title: "Noche Punk", image: "https://example.com/a.jpg" }),
  ];
  assert.deepEqual(dedupeEvents(events).map(({ id }) => id), ["con"]);
});

test("si ambos (o ninguno) traen imagen, gana la descripcion mas larga", () => {
  const events = [
    makeEvent({ id: "corta", title: "Noche Punk", excerpt: "Corta" }),
    makeEvent({ id: "larga", title: "Noche Punk", excerpt: "Una descripcion bastante mas larga" }),
  ];
  assert.deepEqual(dedupeEvents(events).map(({ id }) => id), ["larga"]);
});

test("el repetido ocupa el lugar de la primera aparicion", () => {
  const events = [
    makeEvent({ id: "a", title: "Uno" }),
    makeEvent({ id: "b", title: "Dos" }),
    makeEvent({ id: "c", title: "Uno", image: "https://example.com/a.jpg" }),
  ];
  assert.deepEqual(dedupeEvents(events).map(({ id }) => id), ["c", "b"]);
});
