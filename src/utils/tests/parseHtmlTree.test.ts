import assert from "node:assert/strict";
import test from "node:test";
import { type HtmlElement, parseHtmlTree } from "../parseHtmlTree";

function child(element: HtmlElement, index: number): HtmlElement {
  const node = element.children[index];
  assert.ok(typeof node === "object", "se esperaba un elemento");
  return node;
}

test("arma el arbol con etiquetas, atributos y texto", () => {
  const root = parseHtmlTree(`<div class="a" data-x='1'><p>Hola <b>mundo</b></p></div>`);
  const div = child(root, 0);
  assert.equal(div.tag, "div");
  assert.deepEqual(div.attrs, { class: "a", "data-x": "1" });
  const p = child(div, 0);
  assert.equal(p.tag, "p");
  assert.equal(p.children[0], "Hola ");
  assert.equal(child(p, 1).tag, "b");
});

test("ignora comentarios, script y style", () => {
  const root = parseHtmlTree(`<!-- nota --><script>var a = "<div>";</script><style>p{}</style><p>ok</p>`);
  assert.equal(root.children.length, 1);
  assert.equal(child(root, 0).tag, "p");
});

test("las etiquetas sin cierre no atrapan a las siguientes", () => {
  const root = parseHtmlTree(`<div><img src="a.jpg"><span>texto</span><br></div>`);
  const div = child(root, 0);
  assert.deepEqual(div.children.map((node) => (typeof node === "string" ? node : node.tag)), ["img", "span", "br"]);
});

test("cierra solo los <li> abiertos y tolera cierres que faltan", () => {
  const root = parseHtmlTree(`<ul><li>uno<li>dos</ul>`);
  const ul = child(root, 0);
  assert.equal(ul.children.length, 2);
});

test("atributos sin valor quedan vacios y se repiten solo una vez", () => {
  const root = parseHtmlTree(`<div itemscope itemtype="x" itemtype="y"></div>`);
  assert.deepEqual(child(root, 0).attrs, { itemscope: "", itemtype: "x" });
});
