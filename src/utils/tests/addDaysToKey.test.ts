import assert from "node:assert/strict";
import test from "node:test";
import { addDaysToKey } from "../addDaysToKey";

test("suma dias dentro del mes", () => {
  assert.equal(addDaysToKey("2026-11-08", 3), "2026-11-11");
});

test("cruza de mes y de ano", () => {
  assert.equal(addDaysToKey("2025-08-30", 3), "2025-09-02");
  assert.equal(addDaysToKey("2025-12-31", 1), "2026-01-01");
});

test("resta con numeros negativos", () => {
  assert.equal(addDaysToKey("2025-01-01", -1), "2024-12-31");
});

test("respeta los anos bisiestos", () => {
  assert.equal(addDaysToKey("2024-02-28", 1), "2024-02-29");
  assert.equal(addDaysToKey("2025-02-28", 1), "2025-03-01");
});

test("cero dias deja el mismo dia", () => {
  assert.equal(addDaysToKey("2026-11-08", 0), "2026-11-08");
});
