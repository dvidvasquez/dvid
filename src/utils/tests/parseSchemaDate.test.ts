import assert from "node:assert/strict";
import test from "node:test";
import { parseSchemaDate } from "../parseSchemaDate";

test("fecha y hora con desfase se pasa a UTC", () => {
  assert.deepEqual(parseSchemaDate("2026-11-14T20:00:00-05:00"), { iso: "2026-11-15T01:00:00.000Z", dateOnly: false });
  assert.deepEqual(parseSchemaDate("2026-11-14T20:00:00Z"), { iso: "2026-11-14T20:00:00.000Z", dateOnly: false });
});

test("entiende el desfase sin dos puntos o con solo la hora", () => {
  assert.equal(parseSchemaDate("2026-11-14T20:00:00-0500")?.iso, "2026-11-15T01:00:00.000Z");
  assert.equal(parseSchemaDate("2026-11-14T20:00:00-05")?.iso, "2026-11-15T01:00:00.000Z");
  assert.equal(parseSchemaDate("2026-11-14 20:00:00-05:00")?.iso, "2026-11-15T01:00:00.000Z");
});

test("sin zona se toma la hora de Colombia", () => {
  assert.deepEqual(parseSchemaDate("2026-11-14T20:00:00"), { iso: "2026-11-15T01:00:00.000Z", dateOnly: false });
  assert.equal(parseSchemaDate("2026-11-14T20:00")?.iso, "2026-11-15T01:00:00.000Z");
});

test("una fecha sin hora es de dia completo y empieza a medianoche de Colombia", () => {
  assert.deepEqual(parseSchemaDate("2026-11-14"), { iso: "2026-11-14T05:00:00.000Z", dateOnly: true });
});

test("con endOfDay una fecha sin hora apunta al inicio del dia siguiente", () => {
  assert.equal(parseSchemaDate("2026-11-29", { endOfDay: true })?.iso, "2026-11-30T05:00:00.000Z");
  assert.equal(parseSchemaDate("2026-12-31", { endOfDay: true })?.iso, "2027-01-01T05:00:00.000Z");
});

test("endOfDay no cambia las fechas con hora", () => {
  assert.equal(parseSchemaDate("2026-11-14T23:00:00-05:00", { endOfDay: true })?.iso, "2026-11-15T04:00:00.000Z");
});

test("lo que no es una fecha da null", () => {
  for (const value of ["", "pronto", "14/11/2026", "2026-13-45T99:99", null, undefined, 20261114, {}]) {
    assert.equal(parseSchemaDate(value), null, String(value));
  }
});
