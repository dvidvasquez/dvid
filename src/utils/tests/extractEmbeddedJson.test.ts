import assert from "node:assert/strict";
import test from "node:test";
import { extractEmbeddedJson } from "../extractEmbeddedJson";

test("lee __NEXT_DATA__ de Next.js (Pages Router)", () => {
  const html = `<script id="__NEXT_DATA__" type="application/json">{"props":{"pageProps":{"events":[{"title":"Rock"}]}}}</script>`;
  assert.deepEqual(extractEmbeddedJson(html), [
    { label: "__NEXT_DATA__", value: { props: { pageProps: { events: [{ title: "Rock" }] } } } },
  ]);
});

test("lee cualquier script application/json y le pone el id como etiqueta", () => {
  const html = `<script type="application/json" id="datos">{"a":1}</script><script type='application/json'>[2]</script>`;
  assert.deepEqual(extractEmbeddedJson(html), [
    { label: "datos", value: { a: 1 } },
    { label: "json", value: [2] },
  ]);
});

test("no confunde application/ld+json con application/json", () => {
  assert.deepEqual(extractEmbeddedJson(`<script type="application/ld+json">{"@type":"Event"}</script>`), []);
});

test("ignora scripts de JSON roto y scripts normales", () => {
  const html = `<script type="application/json">{roto</script><script>var a = {"x":1};</script>`;
  assert.deepEqual(extractEmbeddedJson(html), []);
});

test("arma el flujo RSC del App Router desde los self.__next_f.push", () => {
  const row = `5:["$","div",null,{"events":[{"title":"Techno","startDate":"2026-11-14"}]}]\n`;
  const half = Math.floor(row.length / 2);
  const push = (text: string) => `<script>self.__next_f.push([1,${JSON.stringify(text)}])</script>`;
  const html = [
    `<script>self.__next_f.push([0])</script>`,
    push(`1:I["x",[],"y"]\n`),
    // Una linea cortada entre dos trozos se une.
    push(row.slice(0, half)),
    push(row.slice(half)),
  ].join("");

  const [rsc] = extractEmbeddedJson(html);
  assert.equal(rsc.label, "RSC");
  assert.deepEqual(rsc.value, [["$", "div", null, { events: [{ title: "Techno", startDate: "2026-11-14" }] }]]);
});

test("rearma los datos aplanados de Nuxt 3", () => {
  // Raiz -> { events: [ { title, date } ] }
  const flat = [{ events: 1 }, [2], { title: 3, date: 4 }, "Fiesta", "2026-11-20"];
  const html = `<script type="application/json" id="__NUXT_DATA__">${JSON.stringify(flat)}</script>`;
  assert.deepEqual(extractEmbeddedJson(html), [
    { label: "__NUXT_DATA__", value: { events: [{ title: "Fiesta", date: "2026-11-20" }] } },
  ]);
});

test("Nuxt: sigue las referencias Reactive y no se cuelga con ciclos", () => {
  const flat = [{ state: 1, self: 0 }, ["Reactive", 2], { name: 3 }, "Hola"];
  const html = `<script type="application/json" id="__NUXT_DATA__">${JSON.stringify(flat)}</script>`;
  const [data] = extractEmbeddedJson(html);
  const root = data.value as { state: unknown; self: unknown };
  assert.deepEqual(root.state, { name: "Hola" });
  assert.equal(root.self, root);
});

test("una pagina sin JSON embebido da una lista vacia", () => {
  assert.deepEqual(extractEmbeddedJson("<html><body><p>hola</p></body></html>"), []);
});
