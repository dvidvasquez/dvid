import assert from "node:assert/strict";
import test from "node:test";
import { getRelativeTimeLabel } from "../getRelativeTimeLabel";

test("retorna minutos cuando es menos de una hora", () => {
  const now = Date.now();
  const value = getRelativeTimeLabel(new Date(now - 15 * 60 * 1000));
  assert.equal(value, "Hace unos minutos");
});

test("retorna horas cuando es menos de 24 horas", () => {
  const now = Date.now();
  const value = getRelativeTimeLabel(new Date(now - 3 * 60 * 60 * 1000));
  assert.equal(value, "Hace 3 horas");
});

test("retorna ayer cuando es un dia", () => {
  const now = Date.now();
  const value = getRelativeTimeLabel(new Date(now - 24 * 60 * 60 * 1000));
  assert.equal(value, "Ayer");
});

test("retorna dias cuando supera un dia", () => {
  const now = Date.now();
  const value = getRelativeTimeLabel(new Date(now - 4 * 24 * 60 * 60 * 1000));
  assert.equal(value, "Hace 4 dias");
});
