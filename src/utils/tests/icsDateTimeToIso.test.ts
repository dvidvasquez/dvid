import assert from "node:assert/strict";
import test from "node:test";
import { icsDateTimeToIso } from "../icsDateTimeToIso";

const BOGOTA = "America/Bogota";

test("usa el TZID del campo", () => {
  const date = { value: "2025-08-23T08:00", timeZone: BOGOTA, utc: false, dateOnly: false };
  assert.equal(icsDateTimeToIso(date, "UTC"), "2025-08-23T13:00:00.000Z");
});

test("una hora flotante se lee en la zona por defecto", () => {
  const date = { value: "2025-08-23T08:00", timeZone: null, utc: false, dateOnly: false };
  assert.equal(icsDateTimeToIso(date, BOGOTA), "2025-08-23T13:00:00.000Z");
});

test("una hora con Z ya esta en UTC", () => {
  const date = { value: "2025-08-30T23:00", timeZone: null, utc: true, dateOnly: false };
  assert.equal(icsDateTimeToIso(date, BOGOTA), "2025-08-30T23:00:00.000Z");
});

test("un dia completo empieza a medianoche de la zona", () => {
  const date = { value: "2025-08-30", timeZone: null, utc: false, dateOnly: true };
  assert.equal(icsDateTimeToIso(date, BOGOTA), "2025-08-30T05:00:00.000Z");
});

test("una zona desconocida da null", () => {
  const date = { value: "2025-08-23T08:00", timeZone: "Atlantida/Perdida", utc: false, dateOnly: false };
  assert.equal(icsDateTimeToIso(date, BOGOTA), null);
});
