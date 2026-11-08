import assert from "node:assert/strict";
import test from "node:test";
import { formatRadarClock } from "../formatRadarClock";

const S = " ";

test("pasa de UTC a hora de Colombia (UTC-5)", () => {
  // 2026-11-07T19:30:00Z -> 2:30 p. m. en Bogota
  assert.equal(formatRadarClock(Date.UTC(2026, 10, 7, 19, 30) / 1000), `2:30${S}p.${S}m.`);
});

test("cruza la medianoche hacia el dia anterior", () => {
  // 2026-11-07T03:00:00Z -> 10 p. m. del 6 en Bogota
  assert.equal(formatRadarClock(Date.UTC(2026, 10, 7, 3, 0) / 1000), `10${S}p.${S}m.`);
});
