import assert from "node:assert/strict";
import test from "node:test";
import { extractSpanishDatePage } from "../extractSpanishDatePage";

const NOW = Date.parse("2026-11-09T16:00:00.000Z");

const FICHA = `<html><head>
  <meta property="og:title" content="Medellín Skate Market 2026 | Comfama">
  <meta property="og:image" content="https://cdn.test/skate.jpg">
  <meta name="description" content="Un día de cultura skate.">
</head><body>
  <h1>Medellín Skate Market 2026</h1>
  <h2>Sobre este evento</h2><p>Arte, marcas y competencias.</p>
  <h2>Detalle del evento</h2><h3>Entrada libre con inscripción</h3>
  <h2>Indicaciones</h2>
  <h3>Sábado 14 de noviembre</h3><h3>Bodega Comfama, Nave Central</h3><h3>10:00 a. m.</h3>
</body></html>`;

test("lee titulo, fecha, hora, lugar, imagen y descripcion de una ficha en texto", () => {
  assert.deepEqual(extractSpanishDatePage(FICHA, NOW), {
    "@type": "Event",
    name: "Medellín Skate Market 2026",
    startDate: "2026-11-14T10:00:00-05:00",
    location: "Bodega Comfama, Nave Central",
    image: "https://cdn.test/skate.jpg",
    description: "Un día de cultura skate.",
    isAccessibleForFree: true,
  });
});

test("la hora de la tarde y el año escrito", () => {
  const html = `<h1>Concierto</h1><h3>Viernes 5 de marzo de 2027</h3><h3>7:30 p.m.</h3>`;
  const node = extractSpanishDatePage(html, NOW);
  assert.equal(node?.startDate, "2027-03-05T19:30:00-05:00");
  assert.equal("location" in (node ?? {}), false);
});

test("sin hora queda como fecha sola", () => {
  assert.equal(extractSpanishDatePage(`<h1>Feria</h1><h3>20 de noviembre</h3><h3>Parque Arví</h3>`, NOW)?.startDate, "2026-11-20");
});

test("sin año: lo reciente es de este año y lo que paso hace meses, del siguiente", () => {
  assert.equal(extractSpanishDatePage(`<h1>A</h1><h3>Sábado 31 de octubre</h3>`, NOW)?.startDate, "2026-10-31");
  assert.equal(extractSpanishDatePage(`<h1>B</h1><h3>Sábado 30 de agosto</h3>`, NOW)?.startDate, "2027-08-30");
  assert.equal(extractSpanishDatePage(`<h1>C</h1><h3>Viernes 15 de enero</h3>`, NOW)?.startDate, "2027-01-15");
});

test("usa og:title si no hay h1", () => {
  const html = `<meta property="og:title" content="Taller de cerámica"><h3>Jueves 19 de noviembre</h3>`;
  assert.equal(extractSpanishDatePage(html, NOW)?.name, "Taller de cerámica");
});

test("da null sin titulo o sin fecha en los titulos", () => {
  assert.equal(extractSpanishDatePage(`<h3>Sábado 14 de noviembre</h3>`, NOW), null);
  assert.equal(extractSpanishDatePage(`<h1>Historia</h1><p>El 14 de noviembre pasó algo.</p>`, NOW), null);
  assert.equal(extractSpanishDatePage(`<h1>14 de noviembre</h1>`, NOW), null);
});
