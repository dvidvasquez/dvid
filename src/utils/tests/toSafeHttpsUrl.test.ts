import assert from "node:assert/strict";
import test from "node:test";
import { toSafeHttpsUrl } from "../toSafeHttpsUrl";

test("acepta https", () => {
  assert.equal(toSafeHttpsUrl("https://www.windy.com/webcams/1"), "https://www.windy.com/webcams/1");
});

test("rechaza http, javascript, data, rutas relativas y no-cadenas", () => {
  for (const value of ["http://x.test", "javascript:alert(1)", "data:text/html,x", "/relativa", "", null, undefined, 3]) {
    assert.equal(toSafeHttpsUrl(value), null, String(value));
  }
});
