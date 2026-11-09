import assert from "node:assert/strict";
import test from "node:test";
import { toIsoInZone } from "../toIsoInZone";

test("Bogota va 5 horas detras de UTC", () => {
  assert.equal(toIsoInZone("2025-08-23T08:00", "America/Bogota"), "2025-08-23T13:00:00.000Z");
});

test("pasa al dia siguiente cuando la hora local es de noche", () => {
  assert.equal(toIsoInZone("2025-12-31T20:00", "America/Bogota"), "2026-01-01T01:00:00.000Z");
});

test("respeta el horario de verano de otras zonas", () => {
  assert.equal(toIsoInZone("2025-07-01T12:00", "America/New_York"), "2025-07-01T16:00:00.000Z");
  assert.equal(toIsoInZone("2025-01-15T12:00", "America/New_York"), "2025-01-15T17:00:00.000Z");
});

test("acepta segundos en la hora", () => {
  assert.equal(toIsoInZone("2025-08-23T08:00:00", "America/Bogota"), "2025-08-23T13:00:00.000Z");
});

test("da null con una zona desconocida", () => {
  assert.equal(toIsoInZone("2025-08-23T08:00", "Mars/Olympus"), null);
});

test("da null con una fecha invalida", () => {
  assert.equal(toIsoInZone("no es fecha", "America/Bogota"), null);
});
