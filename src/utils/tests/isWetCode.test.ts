import assert from "node:assert/strict";
import test from "node:test";
import { isWetCode } from "../isWetCode";

test("llovizna, lluvia, chubascos y tormenta son humedos", () => {
  for (const code of [51, 55, 61, 65, 67, 80, 82, 95, 99]) assert.equal(isWetCode(code), true, String(code));
});

test("despejado, nublado, niebla y nieve no son humedos", () => {
  for (const code of [0, 1, 2, 3, 45, 48, 50, 71, 77, 79]) assert.equal(isWetCode(code), false, String(code));
});
