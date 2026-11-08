import assert from "node:assert/strict";
import test from "node:test";
import { buildBarPath } from "../buildBarPath";

test("barra normal con esquinas de 4 px arriba", () => {
  assert.equal(buildBarPath(50, 10, 100, 60), "M45 100V64Q45 60 49 60H51Q55 60 55 64V100Z");
});

test("una barra muy baja se dibuja de 2 px", () => {
  assert.equal(buildBarPath(50, 10, 100, 99.5), "M45 100V100Q45 98 47 98H53Q55 98 55 100V100Z");
});

test("el radio no pasa de la mitad del ancho", () => {
  assert.equal(buildBarPath(10, 4, 50, 10), "M8 50V12Q8 10 10 10H10Q12 10 12 12V50Z");
});
