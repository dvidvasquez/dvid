import assert from "node:assert/strict";
import test from "node:test";
import { CHART_MARGIN } from "@/constants/chart";
import { getChartIndex } from "../getChartIndex";

const W = 400;
const slot = (W - CHART_MARGIN.left - CHART_MARGIN.right) / 24;

test("el borde izquierdo y derecho dan el primero y el ultimo punto", () => {
  assert.equal(getChartIndex(0, W, 25), 0);
  assert.equal(getChartIndex(W, W, 25), 24);
});

test("elige el punto mas cercano", () => {
  assert.equal(getChartIndex(CHART_MARGIN.left + slot * 5.2, W, 25), 5);
  assert.equal(getChartIndex(CHART_MARGIN.left + slot * 5.6, W, 25), 6);
});

test("con un solo punto siempre es el cero", () => {
  assert.equal(getChartIndex(200, W, 1), 0);
});
