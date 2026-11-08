import assert from "node:assert/strict";
import test from "node:test";
import { getTooltipLeft } from "../getTooltipLeft";

test("centra el tooltip sobre el cursor cuando cabe", () => {
  assert.equal(getTooltipLeft(150, 80, 400), 150);
});

test("no se sale por los bordes", () => {
  assert.equal(getTooltipLeft(5, 80, 400), 44);
  assert.equal(getTooltipLeft(395, 80, 400), 356);
});
