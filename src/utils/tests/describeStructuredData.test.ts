import assert from "node:assert/strict";
import test from "node:test";
import { describeStructuredData } from "../describeStructuredData";

test("avisa cuando la pagina no trae JSON-LD ni microdatos", () => {
  assert.equal(describeStructuredData("<html></html>", []), "sin bloques JSON-LD, microdatos de evento: 0");
});

test("cuenta los bloques JSON-LD y lista sus tipos sin repetir", () => {
  const blocks = [
    { "@type": "Organization" },
    { "@graph": [{ "@type": "WebSite" }, { "@type": "Organization" }] },
    [{ "@type": ["BreadcrumbList", "Thing"] }],
  ];
  assert.equal(
    describeStructuredData("", blocks),
    "3 bloques JSON-LD de tipo Organization, WebSite, BreadcrumbList, Thing, microdatos de evento: 0",
  );
});

test("usa singular con un solo bloque y no inventa tipos", () => {
  assert.equal(describeStructuredData("", [{ a: 1 }]), "1 bloque JSON-LD, microdatos de evento: 0");
});

test("limita la lista de tipos a cuatro", () => {
  const blocks = ["A", "B", "C", "D", "E"].map((type) => ({ "@type": type }));
  assert.equal(describeStructuredData("", blocks), "5 bloques JSON-LD de tipo A, B, C, D, microdatos de evento: 0");
});

test("cuenta los microdatos de evento de schema.org", () => {
  const html = `<div itemscope itemtype="https://schema.org/MusicEvent"></div>
    <div itemscope itemtype='http://schema.org/Event'></div>
    <div itemscope itemtype="https://schema.org/Person"></div>`;
  assert.equal(describeStructuredData(html, []), "sin bloques JSON-LD, microdatos de evento: 2");
});

test("detecta Next.js y Nuxt", () => {
  assert.equal(
    describeStructuredData(`<script id="__NEXT_DATA__" type="application/json">{}</script>`, []),
    "sin bloques JSON-LD, microdatos de evento: 0, Next.js",
  );
  assert.equal(
    describeStructuredData(`<script type="application/json" id="__NUXT_DATA__">[]</script>`, []),
    "sin bloques JSON-LD, microdatos de evento: 0, Nuxt",
  );
});
