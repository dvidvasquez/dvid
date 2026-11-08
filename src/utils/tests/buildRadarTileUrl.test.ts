import assert from "node:assert/strict";
import test from "node:test";
import { buildRadarTileUrl } from "../buildRadarTileUrl";

test("arma la plantilla de mosaicos con la ruta tal cual", () => {
  assert.equal(
    buildRadarTileUrl("https://tilecache.rainviewer.com", "/v2/radar/abc123"),
    "https://tilecache.rainviewer.com/v2/radar/abc123/256/{z}/{x}/{y}/2/1_1.png",
  );
});
