import assert from "node:assert/strict";
import test from "node:test";
import { getEventCover } from "../getEventCover";

const DEFAULT = "/defaults/events.svg";

test("usa la imagen del evento cuando es https", () => {
  assert.equal(
    getEventCover("https://medellinguru.com/wp-content/uploads/2025/08/9.-Pianoton-2025.webp"),
    "https://medellinguru.com/wp-content/uploads/2025/08/9.-Pianoton-2025.webp",
  );
});

test("sin imagen usa la portada por defecto", () => {
  assert.equal(getEventCover(null), DEFAULT);
  assert.equal(getEventCover(undefined), DEFAULT);
  assert.equal(getEventCover("   "), DEFAULT);
});

test("rechaza lo que no es https", () => {
  assert.equal(getEventCover("http://example.com/a.jpg"), DEFAULT);
  assert.equal(getEventCover("javascript:alert(1)"), DEFAULT);
  assert.equal(getEventCover("/uploads/a.jpg"), DEFAULT);
});

test("quita los espacios alrededor", () => {
  assert.equal(getEventCover("  https://example.com/a.jpg "), "https://example.com/a.jpg");
});
