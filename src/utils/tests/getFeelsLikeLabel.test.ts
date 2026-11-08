import assert from "node:assert/strict";
import test from "node:test";
import { getFeelsLikeLabel } from "../getFeelsLikeLabel";

test("compara sensacion termica con temperatura", () => {
  assert.equal(getFeelsLikeLabel(26, 24), "Se siente más calor");
  assert.equal(getFeelsLikeLabel(22, 24), "Se siente más fresco");
  assert.equal(getFeelsLikeLabel(24.8, 24), "Similar a la temperatura");
  assert.equal(getFeelsLikeLabel(25, 24), "Similar a la temperatura");
});
