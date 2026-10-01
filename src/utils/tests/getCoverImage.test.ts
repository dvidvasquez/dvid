import assert from "node:assert/strict";
import test from "node:test";
import { getCoverImage, getDefaultCover } from "../getCoverImage";

test("retorna la imagen original cuando existe", () => {
  assert.equal(getCoverImage("https://x.supabase.co/a.jpg", "blog"), "https://x.supabase.co/a.jpg");
});

test("usa la portada por defecto cuando la imagen esta vacia", () => {
  assert.equal(getCoverImage("", "travel"), "/defaults/travel.svg");
});

test("usa la portada por defecto cuando la imagen solo tiene espacios", () => {
  assert.equal(getCoverImage("   ", "project"), "/defaults/project.svg");
});

test("usa la portada por defecto cuando la imagen es nula", () => {
  assert.equal(getCoverImage(null, "blog"), "/defaults/blog.svg");
});

test("expone la portada por defecto de cada tipo", () => {
  assert.equal(getDefaultCover("project"), "/defaults/project.svg");
});
