import assert from "node:assert/strict";
import test from "node:test";
import { getBarWidth } from "../getBarWidth";

test("queda entre 4 y 20 px", () => {
  assert.equal(getBarWidth(6), 4);
  assert.equal(getBarWidth(14), 10);
  assert.equal(getBarWidth(60), 20);
});
