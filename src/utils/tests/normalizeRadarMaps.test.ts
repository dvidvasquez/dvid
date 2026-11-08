import assert from "node:assert/strict";
import test from "node:test";
import { normalizeRadarMaps } from "../normalizeRadarMaps";

test("junta los cuadros pasados y los de pronostico", () => {
  const maps = normalizeRadarMaps({
    host: "https://tilecache.rainviewer.com",
    radar: {
      past: [{ time: 100, path: "/v2/radar/abc123" }, { time: 700, path: "/v2/radar/def456" }],
      nowcast: [{ time: 1300, path: "/v2/radar/nc789" }],
    },
  });
  assert.ok(maps);
  assert.equal(maps.host, "https://tilecache.rainviewer.com");
  assert.deepEqual(maps.frames, [
    { time: 100, path: "/v2/radar/abc123", forecast: false },
    { time: 700, path: "/v2/radar/def456", forecast: false },
    { time: 1300, path: "/v2/radar/nc789", forecast: true },
  ]);
});

test("descarta cuadros con ruta rara o sin hora", () => {
  const maps = normalizeRadarMaps({
    host: "https://tilecache.rainviewer.com",
    radar: {
      past: [
        { time: 1, path: "/v2/radar/ok" },
        { time: 2, path: "https://evil.example/x" },
        { time: 3, path: "/v2/radar/a b" },
        { time: "4", path: "/v2/radar/c" },
        { path: "/v2/radar/d" },
      ],
    },
  });
  assert.deepEqual(maps?.frames.map((f) => f.path), ["/v2/radar/ok"]);
});

test("un host que no es https cae en el host por defecto", () => {
  assert.equal(normalizeRadarMaps({ host: "http://x.test", radar: {} })?.host, "https://tilecache.rainviewer.com");
  assert.equal(normalizeRadarMaps({ radar: {} })?.host, "https://tilecache.rainviewer.com");
});

test("sin radar devuelve cero cuadros; sin objeto devuelve null", () => {
  assert.deepEqual(normalizeRadarMaps({ host: "https://tilecache.rainviewer.com" })?.frames, []);
  assert.equal(normalizeRadarMaps(null), null);
  assert.equal(normalizeRadarMaps("x"), null);
});
