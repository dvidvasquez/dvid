import assert from "node:assert/strict";
import test from "node:test";
import { foldText } from "../foldText";

test("quita tildes y pasa a minusculas", () => {
  assert.equal(foldText("Electrónica"), "electronica");
  assert.equal(foldText("MEDELLÍN"), "medellin");
});

test("la enie tambien pierde la virgulilla", () => {
  assert.equal(foldText("Año Nuevo"), "ano nuevo");
});

test("deja intacto lo que ya es simple", () => {
  assert.equal(foldText("rock 2026"), "rock 2026");
});
