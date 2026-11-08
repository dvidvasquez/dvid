import assert from "node:assert/strict";
import test from "node:test";
import { toFiniteNumber } from "../toFiniteNumber";

test("deja pasar numeros finitos", () => {
  assert.equal(toFiniteNumber(0), 0);
  assert.equal(toFiniteNumber(-3.5), -3.5);
});

test("rechaza lo que no sea un numero finito", () => {
  assert.equal(toFiniteNumber(null), null);
  assert.equal(toFiniteNumber("12"), null);
  assert.equal(toFiniteNumber(Number.NaN), null);
  assert.equal(toFiniteNumber(Infinity), null);
});

test("usa el valor de respaldo si se indica", () => {
  assert.equal(toFiniteNumber(null, 0), 0);
  assert.equal(toFiniteNumber(undefined, 7), 7);
  assert.equal(toFiniteNumber(4, 7), 4);
});
