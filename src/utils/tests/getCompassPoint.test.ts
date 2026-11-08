import assert from "node:assert/strict";
import test from "node:test";
import { getCompassPoint } from "../getCompassPoint";

test("convierte grados en puntos cardinales", () => {
  assert.equal(getCompassPoint(0), "N");
  assert.equal(getCompassPoint(90), "E");
  assert.equal(getCompassPoint(180), "S");
  assert.equal(getCompassPoint(270), "O");
  assert.equal(getCompassPoint(315), "NO");
});

test("360 grados vuelve al norte y los negativos no rompen", () => {
  assert.equal(getCompassPoint(360), "N");
  assert.equal(getCompassPoint(-45), "NO");
  assert.equal(getCompassPoint(22), "N");
  assert.equal(getCompassPoint(23), "NE");
});
