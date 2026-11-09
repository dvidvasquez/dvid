import assert from "node:assert/strict";
import test from "node:test";
import { getResultsSummary } from "../getResultsSummary";

test("usa plural cuando hay varios", () => {
  assert.equal(getResultsSummary(12, 3), "12 eventos en 3 días");
});

test("usa singular cuando hay uno", () => {
  assert.equal(getResultsSummary(1, 1), "1 evento en 1 día");
});

test("un dia puede tener varios eventos", () => {
  assert.equal(getResultsSummary(4, 1), "4 eventos en 1 día");
});

test("sin eventos no menciona los dias", () => {
  assert.equal(getResultsSummary(0, 0), "Sin eventos");
});
