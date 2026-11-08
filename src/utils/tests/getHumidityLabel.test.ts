import assert from "node:assert/strict";
import test from "node:test";
import { getHumidityLabel } from "../getHumidityLabel";

test("clasifica la humedad", () => {
  assert.equal(getHumidityLabel(39), "Aire seco");
  assert.equal(getHumidityLabel(40), "Cómodo");
  assert.equal(getHumidityLabel(70), "Húmedo");
  assert.equal(getHumidityLabel(85), "Muy húmedo");
});
