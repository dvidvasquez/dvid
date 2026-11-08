import assert from "node:assert/strict";
import test from "node:test";
import { formatLocalTime } from "../formatLocalTime";

const S = " ";

test("convierte la hora local sin cambiar de zona", () => {
  assert.equal(formatLocalTime("2026-11-07T18:05"), `6:05${S}p.${S}m.`);
  assert.equal(formatLocalTime("2026-11-07T06:00"), `6${S}a.${S}m.`);
});
