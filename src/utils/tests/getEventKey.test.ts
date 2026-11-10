import assert from "node:assert/strict";
import test from "node:test";
import { getEventKey } from "../getEventKey";

test("une titulo normalizado y dia de inicio en hora de Colombia", () => {
  assert.equal(getEventKey({ title: "¡Noche de Electrónica!", start: "2026-11-15T01:00:00.000Z" }), "noche de electronica|2026-11-14");
});

test("el mismo titulo con otra puntuacion o mayusculas da la misma clave", () => {
  const start = "2026-11-14T23:00:00.000Z";
  assert.equal(getEventKey({ title: "FESTIVAL  de la Empanada", start }), getEventKey({ title: "Festival de la empanada.", start }));
});

test("otro dia da otra clave", () => {
  assert.notEqual(
    getEventKey({ title: "Noche Punk", start: "2026-11-14T23:00:00.000Z" }),
    getEventKey({ title: "Noche Punk", start: "2026-11-15T23:00:00.000Z" }),
  );
});
