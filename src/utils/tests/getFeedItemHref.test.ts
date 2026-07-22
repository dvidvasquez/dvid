import assert from "node:assert/strict";
import test from "node:test";
import { getFeedItemHref } from "../getFeedItemHref";

test("usa el slug para posts de blog", () => {
  const href = getFeedItemHref({ type: "blog", id: "1", slug: "mi-post" });
  assert.equal(href, "/blog/mi-post");
});

test("cae al id cuando el post de blog no tiene slug", () => {
  const href = getFeedItemHref({ type: "blog", id: "1" });
  assert.equal(href, "/blog/1");
});

test("usa el id para viajes", () => {
  const href = getFeedItemHref({ type: "travel", id: "2" });
  assert.equal(href, "/travels/2");
});

test("usa el id para proyectos", () => {
  const href = getFeedItemHref({ type: "project", id: "3" });
  assert.equal(href, "/projects/3");
});
