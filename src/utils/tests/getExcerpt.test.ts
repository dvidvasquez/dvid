import assert from "node:assert/strict";
import test from "node:test";
import { getExcerpt } from "../getExcerpt";

test("retorna el texto completo cuando cabe en el limite", () => {
  assert.equal(getExcerpt("Un texto corto", 20), "Un texto corto");
});

test("corta sin partir palabras y agrega puntos suspensivos", () => {
  assert.equal(getExcerpt("Guia practica para arrancar un proyecto", 20), "Guia practica para…");
});

test("quita la puntuacion final antes de los puntos suspensivos", () => {
  assert.equal(getExcerpt("Primero esto, luego aquello otro", 14), "Primero esto…");
});

test("colapsa saltos de linea y espacios repetidos", () => {
  assert.equal(getExcerpt("  Hola\n\nmundo   bonito  ", 50), "Hola mundo bonito");
});

test("corta en seco cuando la primera palabra excede el limite", () => {
  assert.equal(getExcerpt("Supercalifragilistico", 5), "Super…");
});
