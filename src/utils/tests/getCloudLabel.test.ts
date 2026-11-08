import assert from "node:assert/strict";
import test from "node:test";
import { getCloudLabel } from "../getCloudLabel";

test("clasifica la nubosidad", () => {
  assert.equal(getCloudLabel(0), "Cielo despejado");
  assert.equal(getCloudLabel(20), "Algo nublado");
  assert.equal(getCloudLabel(60), "Muy nublado");
  assert.equal(getCloudLabel(90), "Cubierto");
});
