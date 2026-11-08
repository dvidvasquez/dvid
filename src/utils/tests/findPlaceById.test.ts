import assert from "node:assert/strict";
import test from "node:test";
import { findPlaceById } from "../findPlaceById";

const places = [{ id: "a", name: "A", lat: 1, lon: 1 }];

test("encuentra por id", () => {
  assert.equal(findPlaceById(places, "a")?.name, "A");
});

test("ids desconocidos, nulos o vacios dan null", () => {
  assert.equal(findPlaceById(places, "z"), null);
  assert.equal(findPlaceById(places, null), null);
  assert.equal(findPlaceById(places, undefined), null);
});
