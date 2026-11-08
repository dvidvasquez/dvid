import assert from "node:assert/strict";
import test from "node:test";
import { getAgeLabel } from "../getAgeLabel";

const S = " ";

test("sin dato devuelve vacio", () => {
  assert.equal(getAgeLabel(0, 1_000_000), "");
});

test("menos de un minuto", () => {
  assert.equal(getAgeLabel(1_000_000, 1_030_000), `hace menos de 1${S}min`);
});

test("minutos transcurridos", () => {
  assert.equal(getAgeLabel(1_000_000, 1_000_000 + 7 * 60_000 + 5_000), `hace 7${S}min`);
});
