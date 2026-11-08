import assert from "node:assert/strict";
import test from "node:test";
import { describeWeather } from "../describeWeather";

test("describe un codigo conocido", () => {
  assert.deepEqual(describeWeather(63), { label: "Lluvia moderada", kind: "rain" });
  assert.deepEqual(describeWeather(95), { label: "Tormenta eléctrica", kind: "storm" });
});

test("un codigo desconocido cae en 'Sin dato' nublado", () => {
  assert.deepEqual(describeWeather(1234), { label: "Sin dato", kind: "cloudy" });
  assert.deepEqual(describeWeather(-1), { label: "Sin dato", kind: "cloudy" });
});
