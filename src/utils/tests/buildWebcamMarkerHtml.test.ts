import assert from "node:assert/strict";
import test from "node:test";
import { buildWebcamMarkerHtml } from "../buildWebcamMarkerHtml";

const classes = { pill: "cam", selected: "sel" };

test("incluye el icono de camara", () => {
  const html = buildWebcamMarkerHtml(false, classes);
  assert.ok(html.startsWith('<span class="cam"><svg'));
  assert.ok(html.includes("<circle"));
});

test("la seleccionada agrega su clase", () => {
  assert.ok(buildWebcamMarkerHtml(true, classes).startsWith('<span class="cam sel">'));
});
