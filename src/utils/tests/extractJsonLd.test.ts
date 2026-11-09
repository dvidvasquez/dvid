import assert from "node:assert/strict";
import test from "node:test";
import { extractJsonLd } from "../extractJsonLd";
import { ARRAY_PAGE } from "./fixtures/jsonLdPages";

test("lee cada bloque JSON-LD de la pagina", () => {
  const blocks = extractJsonLd(ARRAY_PAGE);
  assert.equal(blocks.length, 2);
  assert.deepEqual(blocks[0], { "@context": "https://schema.org", "@type": "Organization", name: "Sitio" });
  assert.equal(Array.isArray(blocks[1]), true);
});

test("ignora los bloques que no son JSON y sigue con el resto", () => {
  const html = `<script type="application/ld+json">{ roto </script><script type="application/ld+json">{"a":1}</script>`;
  assert.deepEqual(extractJsonLd(html), [{ a: 1 }]);
});

test("acepta comillas simples, mayusculas y otros atributos en la etiqueta", () => {
  const html = `<SCRIPT id="x" TYPE='application/ld+json' data-n="1">{"a":2}</SCRIPT>`;
  assert.deepEqual(extractJsonLd(html), [{ a: 2 }]);
});

test("pela el comentario o CDATA que envuelve el JSON", () => {
  assert.deepEqual(extractJsonLd(`<script type="application/ld+json"><!-- {"a":3} --></script>`), [{ a: 3 }]);
  assert.deepEqual(extractJsonLd(`<script type="application/ld+json">//<![CDATA[\n{"a":4}\n//]]></script>`), [{ a: 4 }]);
});

test("otros scripts no cuentan y sin bloques da una lista vacia", () => {
  assert.deepEqual(extractJsonLd(`<script type="application/json">{"a":5}</script><script>var a = 1;</script>`), []);
  assert.deepEqual(extractJsonLd(""), []);
});
