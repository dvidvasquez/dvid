import assert from "node:assert/strict";
import test from "node:test";
import { toWebcamList } from "../toWebcamList";

const cam = {
  id: 7,
  title: " Comuna 14 ",
  lat: 6.2,
  lon: -75.5,
  thumbnail: "https://img.test/t.jpg",
  preview: "https://img.test/p.jpg",
  pageUrl: "https://www.windy.com/webcams/7",
  liveUrl: null,
  dayUrl: "https://webcams.windy.com/day",
  updatedAt: "2026-11-07T20:00:00.000Z",
};

test("acepta la lista que entrega la API", () => {
  const [item] = toWebcamList({ webcams: [cam], fetchedAt: "x" });
  assert.equal(item.id, 7);
  assert.equal(item.title, "Comuna 14");
  assert.equal(item.preview, "https://img.test/p.jpg");
  assert.equal(item.liveUrl, null);
});

test("descarta camaras sin id o coordenadas", () => {
  const list = toWebcamList({ webcams: [cam, { ...cam, id: "x" }, { ...cam, lat: null }, null, 3] });
  assert.equal(list.length, 1);
});

test("los enlaces que no son https quedan en null", () => {
  const [item] = toWebcamList({ webcams: [{ ...cam, preview: "javascript:alert(1)", pageUrl: "http://x.test", thumbnail: "//x.test/a.jpg" }] });
  assert.equal(item.preview, null);
  assert.equal(item.pageUrl, null);
  assert.equal(item.thumbnail, null);
});

test("sin titulo usa 'Cámara'", () => {
  assert.equal(toWebcamList({ webcams: [{ ...cam, title: "  " }] })[0].title, "Cámara");
});

test("una respuesta de error o rara da lista vacia", () => {
  assert.deepEqual(toWebcamList({ error: "no-key" }), []);
  assert.deepEqual(toWebcamList(null), []);
  assert.deepEqual(toWebcamList("x"), []);
});
