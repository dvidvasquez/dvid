import assert from "node:assert/strict";
import test from "node:test";
import type { RadarFrame } from "@/types/weather";
import { getLatestPastIndex } from "../getLatestPastIndex";

const frame = (time: number, forecast: boolean): RadarFrame => ({ time, path: `/p/${time}`, forecast });

test("es el ultimo cuadro real, antes del pronostico", () => {
  assert.equal(getLatestPastIndex([frame(1, false), frame(2, false), frame(3, true), frame(4, true)]), 1);
});

test("sin pronostico es el ultimo", () => {
  assert.equal(getLatestPastIndex([frame(1, false), frame(2, false)]), 1);
});

test("sin cuadros reales o sin cuadros es 0", () => {
  assert.equal(getLatestPastIndex([frame(1, true)]), 0);
  assert.equal(getLatestPastIndex([]), 0);
});
