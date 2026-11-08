import assert from "node:assert/strict";
import test from "node:test";
import { normalizeForecast } from "../normalizeForecast";

const raw = {
  current: {
    time: "2026-11-07T14:15",
    temperature_2m: 24.3,
    relative_humidity_2m: 71,
    apparent_temperature: 26.1,
    is_day: 1,
    precipitation: 0.2,
    weather_code: 61,
    cloud_cover: 80,
    surface_pressure: 842.5,
    wind_speed_10m: 7.2,
    wind_direction_10m: 200,
    wind_gusts_10m: 18,
  },
  hourly: {
    time: ["2026-11-07T14:00", "2026-11-07T15:00", "2026-11-07T16:00"],
    temperature_2m: [24, 23.5, null],
    precipitation_probability: [60, null, 10],
    precipitation: [0.2, 0, 0],
    weather_code: [61, 3, 3],
  },
  daily: {
    time: ["2026-11-07", "2026-11-08"],
    weather_code: [63, 3],
    temperature_2m_max: [27.2, 26],
    temperature_2m_min: [17.1, 16.5],
    precipitation_sum: [4.2, 0],
    precipitation_probability_max: [90, null],
    sunrise: ["2026-11-07T05:52", "2026-11-08T05:52"],
    sunset: ["2026-11-07T17:48", "2026-11-08T17:48"],
    uv_index_max: [9.1, 8],
  },
};

test("convierte los arreglos paralelos en objetos", () => {
  const f = normalizeForecast(raw);
  assert.ok(f);
  assert.equal(f.current.temperature, 24.3);
  assert.equal(f.current.apparent, 26.1);
  assert.equal(f.current.isDay, true);
  assert.equal(f.current.code, 61);
  assert.equal(f.current.windGusts, 18);
  assert.equal(f.daily.length, 2);
  assert.deepEqual(f.daily[0], {
    date: "2026-11-07",
    code: 63,
    max: 27.2,
    min: 17.1,
    precipSum: 4.2,
    precipProbMax: 90,
    sunrise: "2026-11-07T05:52",
    sunset: "2026-11-07T17:48",
    uvMax: 9.1,
  });
  assert.equal(f.daily[1].precipProbMax, 0);
});

test("omite las horas sin temperatura y trata la probabilidad nula como 0", () => {
  const f = normalizeForecast(raw);
  assert.ok(f);
  assert.equal(f.hourly.length, 2);
  assert.equal(f.hourly[1].precipProbability, 0);
});

test("is_day 0 es de noche", () => {
  const f = normalizeForecast({ ...raw, current: { ...raw.current, is_day: 0 } });
  assert.equal(f?.current.isDay, false);
});

test("sin lo minimo devuelve null", () => {
  assert.equal(normalizeForecast(null), null);
  assert.equal(normalizeForecast({}), null);
  assert.equal(normalizeForecast({ ...raw, current: { time: "x" } }), null);
  assert.equal(normalizeForecast({ ...raw, hourly: { time: [] } }), null);
  assert.equal(normalizeForecast({ ...raw, daily: undefined }), null);
  assert.equal(normalizeForecast({ error: true, reason: "limit" }), null);
});
