import assert from "node:assert/strict";
import test from "node:test";
import { buildPlacesCurrentUrl } from "../buildPlacesCurrentUrl";

test("junta las coordenadas de todos los lugares en el mismo orden", () => {
  const url = new URL(
    buildPlacesCurrentUrl([
      { lat: 6.1, lon: -75.1 },
      { lat: 6.2, lon: -75.2 },
    ]),
  );
  assert.equal(url.searchParams.get("latitude"), "6.1,6.2");
  assert.equal(url.searchParams.get("longitude"), "-75.1,-75.2");
  assert.equal(url.searchParams.get("timezone"), "America/Bogota");
  assert.equal(url.searchParams.get("current"), "temperature_2m,precipitation,weather_code");
});
