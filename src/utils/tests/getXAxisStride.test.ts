import assert from "node:assert/strict";
import test from "node:test";
import { getXAxisStride } from "../getXAxisStride";

test("hay espacio: una etiqueta cada 3 horas", () => {
  assert.equal(getXAxisStride(600, 25), 3);
});

test("poco espacio: una etiqueta cada 6 horas", () => {
  assert.equal(getXAxisStride(360, 25), 6);
});

test("con menos de dos puntos no divide por cero", () => {
  assert.equal(getXAxisStride(300, 1), 3);
});
