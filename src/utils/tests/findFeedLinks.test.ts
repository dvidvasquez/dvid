import assert from "node:assert/strict";
import test from "node:test";
import { findFeedLinks } from "../findFeedLinks";

const BASE = "https://www.ejemplo.co/";

test("encuentra feeds rss y atom anunciados en el head", () => {
  const html = `<head>
    <link rel="alternate" type="application/rss+xml" title="Feed" href="https://www.ejemplo.co/feed/">
    <link rel='alternate' type='application/atom+xml' href='/atom.xml'>
    <link rel="stylesheet" href="/style.css">
  </head>`;
  assert.deepEqual(findFeedLinks(html, BASE), ["https://www.ejemplo.co/feed/", "https://www.ejemplo.co/atom.xml"]);
});

test("ignora feeds de comentarios", () => {
  const html = `<link rel="alternate" type="application/rss+xml" href="https://www.ejemplo.co/comments/feed/">`;
  assert.deepEqual(findFeedLinks(html, BASE), []);
});

test("ignora enlaces que no son alternate o no son feeds", () => {
  const html = `<link rel="alternate" hreflang="en" href="/en/"><link rel="icon" type="image/png" href="/i.png">`;
  assert.deepEqual(findFeedLinks(html, BASE), []);
});

test("no repite el mismo feed", () => {
  const html = `<link rel="alternate" type="application/rss+xml" href="/rss"><link type="application/rss+xml" rel="alternate" href="/rss">`;
  assert.deepEqual(findFeedLinks(html, BASE), ["https://www.ejemplo.co/rss"]);
});
