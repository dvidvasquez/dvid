import assert from "node:assert/strict";
import test from "node:test";
import { parseEventPrice } from "../parseEventPrice";

test("lee pesos con punto o coma de miles", () => {
  assert.equal(parseEventPrice("$ 25.000"), 25000);
  assert.equal(parseEventPrice("$25,000"), 25000);
  assert.equal(parseEventPrice("COP 1.250.000"), 1250000);
});

test("en un rango toma el precio mas bajo", () => {
  assert.equal(parseEventPrice("$ 30.000 - $ 80.000"), 30000);
});

test("gratis, libre y free son 0", () => {
  assert.equal(parseEventPrice("Gratis"), 0);
  assert.equal(parseEventPrice("Entrada libre"), 0);
  assert.equal(parseEventPrice("Free"), 0);
  assert.equal(parseEventPrice("0"), 0);
});

test("sin precio o con texto sin numeros es null", () => {
  assert.equal(parseEventPrice(""), null);
  assert.equal(parseEventPrice(undefined), null);
  assert.equal(parseEventPrice("Consultar"), null);
});

test("si el texto no trae numeros usa los valores de la fuente", () => {
  assert.equal(parseEventPrice("", ["15000", "40000"]), 15000);
  assert.equal(parseEventPrice(null, ["0"]), 0);
});

test("el texto manda sobre los valores", () => {
  assert.equal(parseEventPrice("$ 20.000", ["15000"]), 20000);
});
