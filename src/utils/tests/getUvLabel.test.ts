import assert from "node:assert/strict";
import test from "node:test";
import { getUvLabel } from "../getUvLabel";

test("clasifica el indice UV", () => {
  assert.equal(getUvLabel(2.9), "Bajo");
  assert.equal(getUvLabel(3), "Moderado");
  assert.equal(getUvLabel(6), "Alto");
  assert.equal(getUvLabel(8), "Muy alto");
  assert.equal(getUvLabel(11), "Extremo");
});
