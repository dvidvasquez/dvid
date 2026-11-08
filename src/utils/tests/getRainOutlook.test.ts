import assert from "node:assert/strict";
import test from "node:test";
import type { HourlyPoint } from "@/types/weather";
import { getRainOutlook } from "../getRainOutlook";

const S = " ";

function hours(values: Array<[number, number]>): HourlyPoint[] {
  return values.map(([precipitation, precipProbability], i) => ({
    time: `2026-11-07T${String(10 + i).padStart(2, "0")}:00`,
    temperature: 20,
    precipProbability,
    precipitation,
    code: 3,
  }));
}

test("sin lluvia ahora ni en las proximas 8 horas", () => {
  const hourly = hours(Array.from({ length: 12 }, () => [0, 10] as [number, number]));
  assert.equal(getRainOutlook({ precipitation: 0, code: 3 }, hourly, 0), "Sin lluvia prevista en las próximas 8 horas");
});

test("avisa la primera hora con lluvia probable", () => {
  const hourly = hours([[0, 0], [0, 10], [0, 20], [0.4, 70], [0, 10]]);
  assert.equal(
    getRainOutlook({ precipitation: 0, code: 3 }, hourly, 0),
    `Lluvia probable hacia las 1${S}p.${S}m. (70${S}% de probabilidad)`,
  );
});

test("si ya llueve, dice cuando podria escampar", () => {
  const hourly = hours([[1, 90], [0.8, 80], [0, 30], [0, 10]]);
  assert.equal(
    getRainOutlook({ precipitation: 1, code: 61 }, hourly, 0),
    `Está lloviendo. Podría escampar hacia las 12${S}p.${S}m.`,
  );
});

test("si ya llueve y no escampa en 6 horas", () => {
  const hourly = hours(Array.from({ length: 10 }, () => [1, 90] as [number, number]));
  assert.equal(getRainOutlook({ precipitation: 1, code: 63 }, hourly, 0), "Está lloviendo y seguiría así las próximas 6 horas");
});

test("no se sale del arreglo cuando quedan pocas horas", () => {
  const hourly = hours([[0, 0], [0, 0]]);
  assert.equal(getRainOutlook({ precipitation: 0, code: 0 }, hourly, 1), "Sin lluvia prevista en las próximas 8 horas");
});
