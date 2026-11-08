import assert from "node:assert/strict";
import test from "node:test";
import { formatPercent } from "../formatPercent";

test("agrega el simbolo con espacio duro y redondea", () => {
  assert.equal(formatPercent(85), "85 %");
  assert.equal(formatPercent(42.6), "43 %");
});
