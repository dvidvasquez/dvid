import assert from "node:assert/strict";
import test from "node:test";
import { getTempScale } from "../getTempScale";

test("rango corto usa pasos de 1 grado", () => {
  assert.deepEqual(getTempScale([21, 22, 24]), { min: 20, max: 25, step: 1 });
});

test("rango medio usa pasos de 2 grados", () => {
  assert.deepEqual(getTempScale([18, 24, 27]), { min: 16, max: 28, step: 2 });
});

test("rango amplio usa pasos de 5 grados", () => {
  assert.deepEqual(getTempScale([10, 30]), { min: 5, max: 35, step: 5 });
});

test("el maximo y el minimo siempre quedan dentro de la escala", () => {
  const temps = [19.3, 23.7, 26.1];
  const { min, max } = getTempScale(temps);
  assert.ok(min <= Math.min(...temps) - 1 + 1e-9);
  assert.ok(max >= Math.max(...temps) + 1 - 1e-9);
});
