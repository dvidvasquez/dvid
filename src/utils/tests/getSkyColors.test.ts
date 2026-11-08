import assert from "node:assert/strict";
import test from "node:test";
import { getSkyColors } from "../getSkyColors";

test("de dia y de noche usan paletas distintas", () => {
  assert.deepEqual(getSkyColors("clear", true), ["#0a3a6b", "#2a74b5"]);
  assert.deepEqual(getSkyColors("clear", false), ["#08122b", "#1b2e55"]);
});

test("llovizna y lluvia comparten cielo; nieve usa el nublado", () => {
  assert.deepEqual(getSkyColors("drizzle", true), getSkyColors("rain", true));
  assert.deepEqual(getSkyColors("snow", false), getSkyColors("cloudy", false));
});
