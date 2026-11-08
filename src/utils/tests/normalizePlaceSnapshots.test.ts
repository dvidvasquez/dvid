import assert from "node:assert/strict";
import test from "node:test";
import { normalizePlaceSnapshots } from "../normalizePlaceSnapshots";

const places = [
  { id: "a", name: "A", lat: 1, lon: 1 },
  { id: "b", name: "B", lat: 2, lon: 2 },
  { id: "c", name: "C", lat: 3, lon: 3 },
];

test("asocia cada respuesta con su lugar por posicion", () => {
  const result = normalizePlaceSnapshots(
    [
      { current: { temperature_2m: 23.6, precipitation: 0, weather_code: 3 } },
      { current: { temperature_2m: 19.2, precipitation: 0.3, weather_code: 3 } },
      { current: { temperature_2m: 21, precipitation: 0, weather_code: 80 } },
    ],
    places,
  );
  assert.deepEqual(result, {
    a: { temperature: 24, wet: false, code: 3 },
    b: { temperature: 19, wet: true, code: 3 },
    c: { temperature: 21, wet: true, code: 80 },
  });
});

test("omite los lugares incompletos", () => {
  const result = normalizePlaceSnapshots([{ current: { temperature_2m: 20, weather_code: 0 } }, null, { current: {} }], places);
  assert.deepEqual(Object.keys(result), ["a"]);
});

test("si la respuesta no es un arreglo no hay resumenes", () => {
  assert.deepEqual(normalizePlaceSnapshots({ error: true }, places), {});
  assert.deepEqual(normalizePlaceSnapshots(null, places), {});
});
