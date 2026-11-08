import assert from "node:assert/strict";
import test from "node:test";
import { formatDecimal } from "../formatDecimal";

test("usa coma decimal y un decimal como maximo", () => {
  assert.equal(formatDecimal(0.5), "0,5");
  assert.equal(formatDecimal(1.26), "1,3");
  assert.equal(formatDecimal(12), "12");
  assert.equal(formatDecimal(0), "0");
});
