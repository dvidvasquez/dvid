import assert from "node:assert/strict";
import test from "node:test";
import { getWebcamForecastLine } from "../getWebcamForecastLine";

test("compara la foto con el pronostico de la zona", () => {
  assert.equal(
    getWebcamForecastLine({ name: "El Poblado" }, { temperature: 22, wet: true, code: 61 }),
    "Pronóstico en El Poblado: 22°, lluvia ligera",
  );
});
