import assert from "node:assert/strict";
import test from "node:test";
import { CHART_MARGIN } from "@/constants/chart";
import { getChartX } from "../getChartX";

test("el primer punto queda en el margen izquierdo y el ultimo en el derecho", () => {
  assert.equal(getChartX(0, 400, 25), CHART_MARGIN.left);
  assert.equal(getChartX(24, 400, 25), 400 - CHART_MARGIN.right);
});

test("reparte los puntos en partes iguales", () => {
  const step = (400 - CHART_MARGIN.left - CHART_MARGIN.right) / 24;
  assert.ok(Math.abs(getChartX(10, 400, 25) - (CHART_MARGIN.left + 10 * step)) < 1e-9);
});

test("con un solo punto no divide por cero", () => {
  assert.equal(getChartX(0, 400, 1), CHART_MARGIN.left);
});
