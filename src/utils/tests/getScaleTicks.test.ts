import assert from "node:assert/strict";
import test from "node:test";
import { getScaleTicks } from "../getScaleTicks";

test("lista los valores de min a max", () => {
  assert.deepEqual(getScaleTicks({ min: 20, max: 25, step: 1 }), [20, 21, 22, 23, 24, 25]);
  assert.deepEqual(getScaleTicks({ min: 0, max: 100, step: 50 }), [0, 50, 100]);
});

test("con pasos decimales no acumula error", () => {
  assert.deepEqual(getScaleTicks({ min: 0, max: 1.5, step: 0.5 }), [0, 0.5, 1, 1.5]);
});
