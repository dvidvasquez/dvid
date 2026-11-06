import assert from "node:assert/strict";
import test from "node:test";
import { normalizeWebcam } from "../normalizeWebcam";

const base = {
  webcamId: 1658011525,
  title: " Comuna 14 - El Poblado ",
  status: "active",
  lastUpdatedOn: "2026-11-06T20:10:00.000Z",
  images: {
    current: {
      icon: "https://imgproxy.windy.com/icon.jpg",
      thumbnail: "https://imgproxy.windy.com/thumb.jpg",
      preview: "https://imgproxy.windy.com/preview.jpg",
    },
  },
  location: { latitude: 6.2, longitude: -75.57 },
  player: { day: "https://webcams.windy.com/webcams/public/embed/player/1658011525/day" },
  urls: { detail: "https://www.windy.com/webcams/1658011525" },
};

test("normaliza una camara completa", () => {
  const cam = normalizeWebcam(base);
  assert.ok(cam);
  assert.equal(cam.id, 1658011525);
  assert.equal(cam.title, "Comuna 14 - El Poblado");
  assert.equal(cam.lat, 6.2);
  assert.equal(cam.lon, -75.57);
  assert.equal(cam.thumbnail, "https://imgproxy.windy.com/thumb.jpg");
  assert.equal(cam.preview, "https://imgproxy.windy.com/preview.jpg");
  assert.equal(cam.pageUrl, "https://www.windy.com/webcams/1658011525");
  assert.equal(cam.dayUrl, "https://webcams.windy.com/webcams/public/embed/player/1658011525/day");
  assert.equal(cam.liveUrl, null);
  assert.equal(cam.updatedAt, "2026-11-06T20:10:00.000Z");
});

test("descarta camaras sin coordenadas validas", () => {
  assert.equal(normalizeWebcam({ ...base, location: { latitude: 6.2 } }), null);
  assert.equal(normalizeWebcam({ ...base, location: { latitude: 120, longitude: 0 } }), null);
});

test("descarta camaras inactivas o sin imagen", () => {
  assert.equal(normalizeWebcam({ ...base, status: "inactive" }), null);
  assert.equal(normalizeWebcam({ ...base, images: {} }), null);
});

test("descarta entradas que no son objetos o no tienen id", () => {
  assert.equal(normalizeWebcam(null), null);
  assert.equal(normalizeWebcam("camara"), null);
  assert.equal(normalizeWebcam({ ...base, webcamId: "abc" }), null);
});

test("solo acepta URLs https", () => {
  const cam = normalizeWebcam({
    ...base,
    images: { current: { preview: "http://inseguro.test/a.jpg", thumbnail: "javascript:alert(1)" } },
  });
  assert.equal(cam, null);

  const enlaceMalo = normalizeWebcam({ ...base, urls: { detail: "javascript:alert(1)" } });
  assert.ok(enlaceMalo);
  assert.equal(enlaceMalo.pageUrl, "https://www.windy.com/webcams/1658011525");
  assert.equal(normalizeWebcam({ ...base, player: { day: "http://x.test/p" } })?.dayUrl, null);
});

test("usa la miniatura como vista previa cuando falta la grande", () => {
  const cam = normalizeWebcam({
    ...base,
    images: { current: { thumbnail: "https://imgproxy.windy.com/thumb.jpg" } },
  });
  assert.ok(cam);
  assert.equal(cam.preview, "https://imgproxy.windy.com/thumb.jpg");
});

test("pone titulo por defecto y tolera fecha invalida", () => {
  const cam = normalizeWebcam({ ...base, title: "  ", lastUpdatedOn: "ayer" });
  assert.ok(cam);
  assert.equal(cam.title, "Cámara sin nombre");
  assert.equal(cam.updatedAt, null);
});
