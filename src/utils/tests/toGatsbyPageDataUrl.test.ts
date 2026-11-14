import assert from "node:assert/strict";
import test from "node:test";
import { toGatsbyPageDataUrl } from "../toGatsbyPageDataUrl";

test("arma la direccion del page-data de una pagina bajo un prefijo", () => {
  assert.equal(
    toGatsbyPageDataUrl("https://www.sitio.test/agenda/evento/skate-market/?x=1#mapa", "/agenda"),
    "https://www.sitio.test/agenda/page-data/evento/skate-market/page-data.json",
  );
  assert.equal(toGatsbyPageDataUrl("https://www.sitio.test/agenda/evento/skate-market", "agenda/"), "https://www.sitio.test/agenda/page-data/evento/skate-market/page-data.json");
});

test("la portada es index", () => {
  assert.equal(toGatsbyPageDataUrl("https://www.sitio.test/agenda/", "/agenda"), "https://www.sitio.test/agenda/page-data/index/page-data.json");
  assert.equal(toGatsbyPageDataUrl("https://www.sitio.test/", ""), "https://www.sitio.test/page-data/index/page-data.json");
});

test("sin prefijo usa la raiz del sitio", () => {
  assert.equal(toGatsbyPageDataUrl("https://www.sitio.test/eventos/jazz/", ""), "https://www.sitio.test/page-data/eventos/jazz/page-data.json");
});

test("da null si la pagina no esta bajo el prefijo o la URL no vale", () => {
  assert.equal(toGatsbyPageDataUrl("https://www.sitio.test/agendas/evento/x/", "/agenda"), null);
  assert.equal(toGatsbyPageDataUrl("https://www.sitio.test/otra/x/", "/agenda"), null);
  assert.equal(toGatsbyPageDataUrl("no es una url", "/agenda"), null);
});
