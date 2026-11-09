import assert from "node:assert/strict";
import test from "node:test";
import { toDayKey } from "../toDayKey";

test("mediodia UTC sigue siendo el mismo dia en Colombia", () => {
  assert.equal(toDayKey("2025-08-23T13:00:00.000Z"), "2025-08-23");
});

test("la noche de Colombia ya es el dia siguiente en UTC, pero cuenta como el dia anterior", () => {
  assert.equal(toDayKey("2025-08-24T03:00:00.000Z"), "2025-08-23");
});

test("el dia cambia a las 05:00 UTC", () => {
  assert.equal(toDayKey("2025-08-24T04:59:59.000Z"), "2025-08-23");
  assert.equal(toDayKey("2025-08-24T05:00:00.000Z"), "2025-08-24");
});

test("acepta milisegundos", () => {
  assert.equal(toDayKey(Date.parse("2026-11-08T23:00:00.000Z")), "2026-11-08");
});

test("una fecha invalida da texto vacio", () => {
  assert.equal(toDayKey("mañana"), "");
});
