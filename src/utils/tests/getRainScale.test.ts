import assert from "node:assert/strict";
import test from "node:test";
import { getRainScale } from "../getRainScale";

test("probabilidad es siempre 0-100", () => {
  assert.deepEqual(getRainScale("prob", [5, 90]), { min: 0, max: 100, step: 50 });
});

test("milimetros: minimo 1 mm con paso de 0,5", () => {
  assert.deepEqual(getRainScale("mm", [0, 0.2]), { min: 0, max: 1, step: 0.5 });
});

test("milimetros: escala segun el pico", () => {
  assert.deepEqual(getRainScale("mm", [0, 1.3, 0.2]), { min: 0, max: 1.5, step: 0.5 });
  assert.deepEqual(getRainScale("mm", [4.2]), { min: 0, max: 5, step: 1 });
  assert.deepEqual(getRainScale("mm", [8.1]), { min: 0, max: 10, step: 2 });
  assert.deepEqual(getRainScale("mm", [12]), { min: 0, max: 15, step: 5 });
});
