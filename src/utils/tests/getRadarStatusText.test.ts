import assert from "node:assert/strict";
import test from "node:test";
import { getRadarStatusText } from "../getRadarStatusText";

const frames = [{ time: 1_000_000, path: "/p", forecast: false }];

test("cargando mientras no hay respuesta", () => {
  assert.equal(getRadarStatusText({ status: "loading", frames: null, index: 0, now: 5 }), "Cargando imagen…");
});

test("error de red", () => {
  assert.match(getRadarStatusText({ status: "error", frames: null, index: 0, now: 5 }), /No se pudo cargar el radar/);
});

test("sin cuadros disponibles", () => {
  assert.equal(getRadarStatusText({ status: "ready", frames: [], index: 0, now: 5 }), "No hay imágenes disponibles en este momento.");
});

test("con cuadro muestra su hora", () => {
  assert.match(getRadarStatusText({ status: "ready", frames, index: 0, now: 1_000_000 * 1000 + 120_000 }), /^Radar de las /);
});

test("sin hora del navegador espera", () => {
  assert.equal(getRadarStatusText({ status: "ready", frames, index: 0, now: 0 }), "Cargando imagen…");
});
