import assert from "node:assert/strict";
import test from "node:test";
import { parseLocalTime } from "../parseLocalTime";

test("lee fecha y hora", () => {
  assert.deepEqual(parseLocalTime("2026-11-07T14:15"), { year: 2026, month: 11, day: 7, hour: 14, minute: 15 });
});

test("sin hora asume medianoche", () => {
  assert.deepEqual(parseLocalTime("2026-01-02"), { year: 2026, month: 1, day: 2, hour: 0, minute: 0 });
});
