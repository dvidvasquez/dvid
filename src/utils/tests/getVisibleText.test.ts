import assert from "node:assert/strict";
import test from "node:test";
import { getVisibleText } from "../getVisibleText";
import { type HtmlElement, parseHtmlTree } from "../parseHtmlTree";

function firstElement(html: string): HtmlElement {
  const node = parseHtmlTree(html).children[0];
  assert.ok(typeof node === "object", "se esperaba un elemento");
  return node;
}

test("junta el texto de todos los hijos", () => {
  assert.equal(getVisibleText(firstElement(`<div><h3>Concierto</h3> <p>Esta <b>noche</b></p></div>`)), "Concierto Esta noche");
});

test("decodifica entidades y no incluye script ni comentarios", () => {
  assert.equal(getVisibleText(firstElement(`<p>Rock &amp; Roll<!-- x --><script>alert(1)</script></p>`)), "Rock & Roll");
});

test("un elemento vacio da texto vacio", () => {
  assert.equal(getVisibleText(firstElement(`<div></div>`)), "");
});
