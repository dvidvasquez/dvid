import assert from "node:assert/strict";
import test from "node:test";
import { buildForecastUrl } from "../buildForecastUrl";

test("arma la consulta completa para un lugar", () => {
  const url = new URL(buildForecastUrl({ lat: 6.2442, lon: -75.5812 }));
  assert.equal(url.origin + url.pathname, "https://api.open-meteo.com/v1/forecast");
  assert.equal(url.searchParams.get("latitude"), "6.2442");
  assert.equal(url.searchParams.get("longitude"), "-75.5812");
  assert.equal(url.searchParams.get("timezone"), "America/Bogota");
  assert.equal(url.searchParams.get("forecast_days"), "7");
  assert.equal(url.searchParams.get("wind_speed_unit"), "kmh");
});

test("pide los campos que usa la pantalla", () => {
  const url = new URL(buildForecastUrl({ lat: 1, lon: 2 }));
  assert.match(url.searchParams.get("current") ?? "", /wind_gusts_10m/);
  assert.match(url.searchParams.get("hourly") ?? "", /precipitation_probability/);
  assert.match(url.searchParams.get("daily") ?? "", /uv_index_max/);
  assert.match(url.searchParams.get("daily") ?? "", /sunset/);
});
