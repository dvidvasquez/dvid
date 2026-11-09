import assert from "node:assert/strict";
import test from "node:test";
import { describeEmbeddedData } from "../describeEmbeddedData";

test("una pagina sin JSON embebido cuenta solo las etiquetas time y article", () => {
  assert.equal(
    describeEmbeddedData(`<article></article><article></article><time datetime="2026-11-14"></time>`, []),
    "etiquetas time: 1, article: 2",
  );
});

test("lista el JSON embebido con sus listas de objetos y la primera fecha", () => {
  const embedded = [
    {
      label: "__NEXT_DATA__",
      value: { props: { pageProps: { menu: [{ label: "Inicio" }], eventos: [{ id: 1, titulo: "Rock", fecha_evento: "2026-11-14T20:00:00" }, { id: 2 }] } } },
    },
  ];
  assert.equal(
    describeEmbeddedData("", embedded),
    "__NEXT_DATA__: pageProps{menu,eventos} props.pageProps.eventos[2]{id,titulo,fecha_evento} fecha_evento=2026-11-14T20:00:00 " +
      "props.pageProps.menu[1]{label}, etiquetas time: 0, article: 0",
  );
});

test("avisa cuando pageProps esta vacio: los datos se piden despues desde el navegador", () => {
  const embedded = [{ label: "__NEXT_DATA__", value: { props: { pageProps: {} }, page: "/programate" } }];
  assert.equal(describeEmbeddedData("", embedded), "__NEXT_DATA__: pageProps vacío, etiquetas time: 0, article: 0");
});

test("reconoce el App Router de Next.js por el flujo RSC", () => {
  const embedded = [{ label: "RSC", value: [["$", "div", null, { items: [{ name: "Taller", date: "14/11/2026" }] }]] }];
  const text = describeEmbeddedData("", embedded);
  assert.match(text, /^Next\.js \(App Router\), RSC: /);
  assert.match(text, /items\[1\]\{name,date\} date=14\/11\/2026/);
});

test("muestra pocas listas y recorta los textos largos", () => {
  const long = "x".repeat(100);
  const embedded = [{ label: "datos", value: { a: [{ f: "2026-11-14" }], b: [{ f: "2026-11-15" }], c: [{ f: "2026-11-16" }], d: [{ k: long }] } }];
  const text = describeEmbeddedData("", embedded);
  assert.equal((text.match(/\[1\]/g) ?? []).length, 2);
  assert.ok(!text.includes(long));
});

test("limita a tres los JSON listados", () => {
  const embedded = ["a", "b", "c", "d", "e"].map((label) => ({ label, value: {} }));
  assert.equal(describeEmbeddedData("", embedded), "a, b, c, 2 JSON más, etiquetas time: 0, article: 0");
});

test("encuentra direcciones de API en el HTML sin repetirlas", () => {
  const html = `<link rel="alternate" href="https://sitio.test/wp-json/"><a href="/api/eventos?x=1">a</a><script>fetch("/api/eventos?x=1")</script>`;
  assert.equal(
    describeEmbeddedData(html, []),
    "etiquetas time: 0, article: 0, API: https://sitio.test/wp-json/ /api/eventos?x=1",
  );
});

test("no cuenta api.w.org, que aparece en todo sitio WordPress, como una API", () => {
  const html = `<link rel="https://api.w.org/" href="https://sitio.test/wp-json/"><link href="//api.w.org/x">`;
  assert.equal(describeEmbeddedData(html, []), "etiquetas time: 0, article: 0, API: https://sitio.test/wp-json/");
});
