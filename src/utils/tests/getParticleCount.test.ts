import assert from "node:assert/strict";
import test from "node:test";
import { getParticleCount } from "../getParticleCount";

test("escala la cantidad segun el area", () => {
  assert.equal(getParticleCount(450, 400), 40);
});

test("respeta el minimo en areas pequenas", () => {
  assert.equal(getParticleCount(100, 100), 24);
});

test("respeta el maximo en areas grandes", () => {
  assert.equal(getParticleCount(1920, 1080), 160);
});

test("retorna cero cuando el area es invalida", () => {
  assert.equal(getParticleCount(0, 300), 0);
});

test("acepta opciones personalizadas", () => {
  assert.equal(getParticleCount(100, 100, { areaPerParticle: 1000, min: 1, max: 5 }), 5);
});
