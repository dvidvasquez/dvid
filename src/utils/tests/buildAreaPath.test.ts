import assert from "node:assert/strict";
import test from "node:test";
import { buildAreaPath } from "../buildAreaPath";

test("cierra el area hasta la base", () => {
  const d = buildAreaPath([{ x: 10, y: 20 }, { x: 30, y: 10 }], 100);
  assert.equal(d, "M10.0 20.0L30.0 10.0L30.0 100.0L10.0 100.0Z");
});

test("sin puntos no dibuja nada", () => {
  assert.equal(buildAreaPath([], 100), "");
});
