import assert from "node:assert/strict";
import test from "node:test";
import { getGatsbyStaticQueryUrls } from "../getGatsbyStaticQueryUrls";

const URL_INDEX = "https://www.sitio.test/agenda/page-data/index/page-data.json";

test("arma la direccion de cada consulta compartida, sin repetir", () => {
  const text = JSON.stringify({ path: "/", result: {}, staticQueryHashes: ["1234567890", "987", "1234567890"] });
  assert.deepEqual(getGatsbyStaticQueryUrls(text, URL_INDEX), [
    "https://www.sitio.test/agenda/page-data/sq/d/1234567890.json",
    "https://www.sitio.test/agenda/page-data/sq/d/987.json",
  ]);
});

test("ignora lo que no parece un hash", () => {
  const text = JSON.stringify({ staticQueryHashes: ["ok-1", "../../etc", 5, ""] });
  assert.deepEqual(getGatsbyStaticQueryUrls(text, URL_INDEX), ["https://www.sitio.test/agenda/page-data/sq/d/ok-1.json"]);
});

test("da una lista vacia si no es un page-data.json", () => {
  assert.deepEqual(getGatsbyStaticQueryUrls("<html></html>", URL_INDEX), []);
  assert.deepEqual(getGatsbyStaticQueryUrls(JSON.stringify({ result: {} }), URL_INDEX), []);
  assert.deepEqual(getGatsbyStaticQueryUrls(JSON.stringify({ staticQueryHashes: ["1"] }), "https://www.sitio.test/agenda/"), []);
});
