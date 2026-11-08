import assert from "node:assert/strict";
import test from "node:test";
import { getRangeBar } from "../getRangeBar";

test("posiciona la barra dentro del rango de la semana", () => {
  assert.deepEqual(getRangeBar(15, 25, 10, 30), { left: 25, width: 50 });
});

test("el ancho minimo es 4 %", () => {
  assert.deepEqual(getRangeBar(20, 20, 10, 30), { left: 50, width: 4 });
});

test("si toda la semana es igual no divide por cero", () => {
  const bar = getRangeBar(20, 20, 20, 20);
  assert.deepEqual(bar, { left: 0, width: 4 });
});
