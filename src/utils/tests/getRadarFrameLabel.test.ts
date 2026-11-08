import assert from "node:assert/strict";
import test from "node:test";
import { getRadarFrameLabel } from "../getRadarFrameLabel";

const S = " ";
const t = Date.UTC(2026, 10, 7, 19, 30) / 1000;

test("un cuadro pasado dice hace cuanto fue", () => {
  const now = (t + 10 * 60) * 1000;
  assert.equal(getRadarFrameLabel({ time: t, path: "/p", forecast: false }, now), `Radar de las 2:30${S}p.${S}m. (hace 10${S}min)`);
});

test("un cuadro de hace un minuto o menos dice ahora", () => {
  assert.equal(getRadarFrameLabel({ time: t, path: "/p", forecast: false }, t * 1000 + 30_000), `Radar de las 2:30${S}p.${S}m. (ahora)`);
});

test("un cuadro de pronostico lo indica", () => {
  assert.equal(getRadarFrameLabel({ time: t + 1800, path: "/p", forecast: true }, t * 1000), `Radar de las 3${S}p.${S}m. (pronóstico)`);
});
