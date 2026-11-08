import assert from "node:assert/strict";
import test from "node:test";
import { escapeHtml } from "../escapeHtml";

test("escapa los caracteres que abren HTML", () => {
  assert.equal(escapeHtml(`<img src=x onerror="a('b')">&`), "&lt;img src=x onerror=&quot;a(&#39;b&#39;)&quot;&gt;&amp;");
});

test("deja intacto el texto normal", () => {
  assert.equal(escapeHtml("San Cristóbal"), "San Cristóbal");
});
