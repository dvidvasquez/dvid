import assert from "node:assert/strict";
import test from "node:test";
import { formatMillimeters } from "../formatMillimeters";

test("milimetros con coma y espacio duro", () => {
  assert.equal(formatMillimeters(0.4), "0,4 mm");
  assert.equal(formatMillimeters(3), "3 mm");
});
