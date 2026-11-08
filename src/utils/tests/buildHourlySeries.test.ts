import assert from "node:assert/strict";
import test from "node:test";
import type { Forecast, HourlyPoint } from "@/types/weather";
import { buildHourlySeries } from "../buildHourlySeries";

function hourly(count: number): HourlyPoint[] {
  return Array.from({ length: count }, (_, i) => {
    const day = 7 + Math.floor(i / 24);
    return {
      time: `2026-11-${String(day).padStart(2, "0")}T${String(i % 24).padStart(2, "0")}:00`,
      temperature: 20 + i,
      precipProbability: 0,
      precipitation: 0,
      code: 0,
    };
  });
}

const current = (time: string) => ({ time }) as Forecast["current"];

test("empieza en la hora actual y toma 25 puntos", () => {
  const series = buildHourlySeries({ current: current("2026-11-07T14:15"), hourly: hourly(48) });
  assert.equal(series.startIndex, 14);
  assert.equal(series.points.length, 25);
  assert.equal(series.points[0].time, "2026-11-07T14:00");
  assert.equal(series.points[24].time, "2026-11-08T14:00");
});

test("si no encuentra la hora actual usa el inicio", () => {
  const series = buildHourlySeries({ current: current("2025-01-01T03:00"), hourly: hourly(30) });
  assert.equal(series.startIndex, 0);
  assert.equal(series.points.length, 25);
});

test("al final del pronostico devuelve los puntos que haya", () => {
  const series = buildHourlySeries({ current: current("2026-11-08T20:10"), hourly: hourly(48) });
  assert.equal(series.points.length, 4);
});
