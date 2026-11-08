import assert from "node:assert/strict";
import test from "node:test";
import { CHART_MARGIN } from "@/constants/chart";
import { getChartY } from "../getChartY";

const scale = { min: 20, max: 30, step: 2 };

test("el maximo queda arriba y el minimo en el eje de abajo", () => {
  assert.equal(getChartY(30, scale, 170), CHART_MARGIN.top);
  assert.equal(getChartY(20, scale, 170), 170 - CHART_MARGIN.bottom);
});

test("el punto medio queda a la mitad", () => {
  assert.equal(getChartY(25, scale, 170), (CHART_MARGIN.top + 170 - CHART_MARGIN.bottom) / 2);
});

test("una escala sin rango no da NaN", () => {
  assert.ok(Number.isFinite(getChartY(5, { min: 5, max: 5, step: 1 }, 100)));
});
