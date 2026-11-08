import assert from "node:assert/strict";
import test from "node:test";
import { isRainingNow } from "../isRainingNow";

test("llueve si cayo 0,1 mm o mas", () => {
  assert.equal(isRainingNow(0.1, 3), true);
  assert.equal(isRainingNow(0.09, 3), false);
});

test("llueve si el codigo es de lluvia aunque no haya milimetros", () => {
  assert.equal(isRainingNow(0, 61), true);
  assert.equal(isRainingNow(0, 0), false);
});
