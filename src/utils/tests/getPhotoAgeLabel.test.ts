import assert from "node:assert/strict";
import test from "node:test";
import { getPhotoAgeLabel } from "../getPhotoAgeLabel";

const S = " ";
const now = Date.parse("2026-11-07T20:00:00.000Z");

test("sin fecha valida", () => {
  assert.equal(getPhotoAgeLabel(null, now), "Hora de la foto no disponible");
  assert.equal(getPhotoAgeLabel("no es fecha", now), "Hora de la foto no disponible");
});

test("hace un momento", () => {
  assert.equal(getPhotoAgeLabel("2026-11-07T19:59:00.000Z", now), "Foto de hace un momento");
  assert.equal(getPhotoAgeLabel("2026-11-07T20:05:00.000Z", now), "Foto de hace un momento");
});

test("minutos y horas", () => {
  assert.equal(getPhotoAgeLabel("2026-11-07T19:45:00.000Z", now), `Foto de hace 15${S}min`);
  assert.equal(getPhotoAgeLabel("2026-11-07T19:00:00.000Z", now), `Foto de hace 1${S}hora`);
  assert.equal(getPhotoAgeLabel("2026-11-07T17:00:00.000Z", now), `Foto de hace 3${S}horas`);
});
