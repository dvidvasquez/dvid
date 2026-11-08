import assert from "node:assert/strict";
import test from "node:test";
import { buildLinePath } from "../buildLinePath";

test("une los puntos con un decimal", () => {
  assert.equal(buildLinePath([{ x: 0, y: 10.04 }, { x: 5.55, y: 20 }]), "M0.0 10.0L5.5 20.0");
});
