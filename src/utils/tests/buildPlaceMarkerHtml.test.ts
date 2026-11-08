import assert from "node:assert/strict";
import test from "node:test";
import { buildPlaceMarkerHtml } from "../buildPlaceMarkerHtml";

const classes = { pill: "pill", selected: "sel", wet: "wet", label: "lbl" };

test("burbuja normal con temperatura", () => {
  assert.equal(buildPlaceMarkerHtml({ name: "Bello", temperature: 24, wet: false, selected: false }, classes), '<span class="pill">24°</span>');
});

test("sin dato muestra un guion", () => {
  assert.equal(buildPlaceMarkerHtml({ name: "Bello", temperature: null, wet: false, selected: false }, classes), '<span class="pill">–</span>');
});

test("la seleccionada con lluvia muestra el nombre y las dos marcas", () => {
  assert.equal(
    buildPlaceMarkerHtml({ name: "El Poblado", temperature: 21, wet: true, selected: true }, classes),
    '<span class="pill sel wet">21°<em class="lbl">El Poblado</em></span>',
  );
});

test("escapa el nombre", () => {
  const html = buildPlaceMarkerHtml({ name: "<b>x</b>", temperature: 1, wet: false, selected: true }, classes);
  assert.ok(!html.includes("<b>"));
  assert.ok(html.includes("&lt;b&gt;"));
});
