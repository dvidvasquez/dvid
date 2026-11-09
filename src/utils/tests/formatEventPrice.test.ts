import assert from "node:assert/strict";
import test from "node:test";
import { formatEventPrice } from "../formatEventPrice";

test("cero es gratis", () => {
  assert.equal(formatEventPrice(0), "Gratis");
});

test("los pesos llevan punto de miles", () => {
  assert.equal(formatEventPrice(25000), "Desde $25.000");
  assert.equal(formatEventPrice(1250000), "Desde $1.250.000");
  assert.equal(formatEventPrice(800), "Desde $800");
});

test("redondea los centavos", () => {
  assert.equal(formatEventPrice(19999.6), "Desde $20.000");
});

test("sin precio no muestra nada", () => {
  assert.equal(formatEventPrice(null), null);
});
