import assert from "node:assert/strict";
import test from "node:test";
import { getOccurrenceKey } from "../getOccurrenceKey";

const EVENT = { title: "Feria de las Flores", start: "2026-11-10T15:00:00.000Z" };

test("une la clave del evento con el dia", () => {
  assert.equal(getOccurrenceKey(EVENT, "2026-11-12"), "feria de las flores|2026-11-10|2026-11-12");
});

test("el mismo evento en dos dias da dos claves", () => {
  assert.notEqual(getOccurrenceKey(EVENT, "2026-11-11"), getOccurrenceKey(EVENT, "2026-11-12"));
});
