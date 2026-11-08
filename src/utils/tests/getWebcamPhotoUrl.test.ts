import assert from "node:assert/strict";
import test from "node:test";
import { getWebcamPhotoUrl } from "../getWebcamPhotoUrl";

test("prefiere la vista previa", () => {
  assert.equal(getWebcamPhotoUrl({ preview: "https://a.test/p.jpg", thumbnail: "https://a.test/t.jpg" }), "https://a.test/p.jpg");
});

test("usa la miniatura si no hay vista previa valida", () => {
  assert.equal(getWebcamPhotoUrl({ preview: null, thumbnail: "https://a.test/t.jpg" }), "https://a.test/t.jpg");
  assert.equal(getWebcamPhotoUrl({ preview: "http://a.test/p.jpg", thumbnail: "https://a.test/t.jpg" }), "https://a.test/t.jpg");
});

test("sin fotos validas devuelve null", () => {
  assert.equal(getWebcamPhotoUrl({ preview: null, thumbnail: null }), null);
});
