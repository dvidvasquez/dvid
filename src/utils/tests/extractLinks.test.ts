import assert from "node:assert/strict";
import test from "node:test";
import { extractLinks } from "../extractLinks";

const PAGE = "https://www.sitio.test/agenda/";

test("saca los enlaces del mismo sitio que contienen el texto, completos y sin repetir", () => {
  const html = `
    <a href="/agenda/evento/skate-market/">Skate</a>
    <a href='https://www.sitio.test/agenda/evento/teatro?x=1&amp;y=2#mapa'>Teatro</a>
    <a href="/agenda/evento/skate-market/">Otra vez</a>
    <a href="/agenda/eventos/cine">Categoría</a>
    <a href="https://otro.test/agenda/evento/ajeno">Ajeno</a>
    <a href="mailto:hola@sitio.test">Correo</a>`;
  assert.deepEqual(extractLinks(html, PAGE, "/agenda/evento/"), [
    "https://www.sitio.test/agenda/evento/skate-market/",
    "https://www.sitio.test/agenda/evento/teatro?x=1&y=2",
  ]);
});

test("resuelve enlaces relativos a la pagina", () => {
  assert.deepEqual(extractLinks(`<a href="evento/jazz">Jazz</a>`, PAGE, "/evento/"), ["https://www.sitio.test/agenda/evento/jazz"]);
});

test("lee un sitemap y pone primero lo modificado mas recientemente", () => {
  const xml = `<?xml version="1.0"?><urlset>
    <url><loc>https://www.sitio.test/agenda/evento/viejo/</loc><lastmod>2025-08-01T10:00:00Z</lastmod></url>
    <url><loc>https://www.sitio.test/agenda/evento/nuevo/</loc><lastmod>2026-11-10T10:00:00Z</lastmod></url>
    <url><loc>https://www.sitio.test/agenda/eventos/cine/</loc><lastmod>2026-11-12T10:00:00Z</lastmod></url>
    <url><loc>https://www.sitio.test/agenda/evento/sin-fecha/</loc></url>
  </urlset>`;
  assert.deepEqual(extractLinks(xml, "https://www.sitio.test/agenda/sitemap-0.xml", "/agenda/evento/"), [
    "https://www.sitio.test/agenda/evento/nuevo/",
    "https://www.sitio.test/agenda/evento/viejo/",
    "https://www.sitio.test/agenda/evento/sin-fecha/",
  ]);
});

test("sin enlaces que coincidan, o con una pagina invalida, da una lista vacia", () => {
  assert.deepEqual(extractLinks(`<a href="/contacto">Contacto</a>`, PAGE, "/evento/"), []);
  assert.deepEqual(extractLinks(`<a href="/evento/x">x</a>`, "no es una url", "/evento/"), []);
});
