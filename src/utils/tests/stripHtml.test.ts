import assert from "node:assert/strict";
import test from "node:test";
import { stripHtml } from "../stripHtml";

test("quita etiquetas y colapsa espacios", () => {
  assert.equal(stripHtml("<p>Hola <strong>mundo</strong></p>\n<p>nuevo</p>"), "Hola mundo nuevo");
});

test("decodifica entidades con nombre y numericas", () => {
  assert.equal(stripHtml("Caf&eacute; &amp; t&#233; &#x2014; &laquo;ok&raquo;"), "Café & té — «ok»");
});

test("respeta mayusculas en entidades con tilde", () => {
  assert.equal(stripHtml("&Aacute;frica y Espa&ntilde;a &ndash; &iquest;s&iacute;?"), "África y España – ¿sí?");
});

test("conserva entidades desconocidas", () => {
  assert.equal(stripHtml("a &foo; b"), "a &foo; b");
});

test("elimina scripts y estilos con su contenido", () => {
  assert.equal(stripHtml("<style>p{}</style>Texto<script>alert(1)</script>"), "Texto");
});

test("retorna vacio cuando solo hay etiquetas", () => {
  assert.equal(stripHtml("<img src='a.jpg' />"), "");
});

test("no deja espacios antes de la puntuacion al quitar etiquetas", () => {
  assert.equal(stripHtml("<p>Hola <b>mundo</b>, ¿todo <em>bien</em>?</p>"), "Hola mundo, ¿todo bien?");
});
