import assert from "node:assert/strict";
import test from "node:test";
import { findNearestPlace } from "../findNearestPlace";

const places = [
  { id: "norte", name: "Norte", lat: 6.4, lon: -75.5 },
  { id: "sur", name: "Sur", lat: 6.1, lon: -75.6 },
];

test("devuelve el lugar mas cercano", () => {
  assert.equal(findNearestPlace(6.35, -75.5, places)?.id, "norte");
  assert.equal(findNearestPlace(6.12, -75.58, places)?.id, "sur");
});

test("sin lugares devuelve null", () => {
  assert.equal(findNearestPlace(6, -75, []), null);
});
