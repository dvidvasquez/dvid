import assert from "node:assert/strict";
import test from "node:test";
import { parseFeed } from "../parseFeed";

const RSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Enter.co</title>
    <link>https://www.enter.co</link>
    <item>
      <title><![CDATA[La IA llega a Medell&iacute;n]]></title>
      <link>https://www.enter.co/ia-medellin/</link>
      <pubDate>Thu, 01 Oct 2026 14:00:00 +0000</pubDate>
      <description><![CDATA[<p>Resumen de la <strong>nota</strong>.</p>]]></description>
      <media:content url="https://cdn.enter.co/ia.jpg" medium="image" />
    </item>
    <item>
      <title>Segunda nota</title>
      <link>/segunda/</link>
      <description>Texto</description>
      <content:encoded><![CDATA[<figure><img src="https://cdn.enter.co/2.webp" alt=""></figure><p>Cuerpo</p>]]></content:encoded>
    </item>
    <item>
      <title>Con enclosure</title>
      <link>https://www.enter.co/3/</link>
      <enclosure url="https://cdn.enter.co/3.png" type="image/png" length="1" />
    </item>
    <item>
      <title>Sin link</title>
    </item>
  </channel>
</rss>`;

const ATOM = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <title>Blog</title>
  <link href="https://devblogs.example.com/" rel="alternate" />
  <entry>
    <title type="html">Novedades &amp; cambios</title>
    <link rel="alternate" type="text/html" href="https://devblogs.example.com/post-1" />
    <link rel="enclosure" type="image/jpeg" href="https://devblogs.example.com/cover.jpg" />
    <published>2026-09-30T10:00:00Z</published>
    <summary type="html">&lt;p&gt;Resumen atom&lt;/p&gt;</summary>
  </entry>
  <entry>
    <title>Solo updated</title>
    <link href="/post-2" />
    <updated>2026-09-29T10:00:00Z</updated>
    <media:thumbnail url="https://devblogs.example.com/t.jpg" />
  </entry>
</feed>`;

const RDF = `<?xml version="1.0"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://purl.org/rss/1.0/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel><title>RDF</title><link>https://rdf.example.com/</link></channel>
  <item>
    <title>Nota RDF</title>
    <link>https://rdf.example.com/nota</link>
    <dc:date>2026-09-28T08:00:00Z</dc:date>
  </item>
</rdf:RDF>`;

test("lee items rss con titulo, link, resumen, imagen y fecha", () => {
  const [first] = parseFeed(RSS);
  assert.equal(first.title, "La IA llega a Medellín");
  assert.equal(first.link, "https://www.enter.co/ia-medellin/");
  assert.equal(first.excerpt, "Resumen de la nota.");
  assert.equal(first.image, "https://cdn.enter.co/ia.jpg");
  assert.equal(first.publishedAt?.toISOString(), "2026-10-01T14:00:00.000Z");
});

test("resuelve links relativos y toma la imagen del contenido html", () => {
  const second = parseFeed(RSS)[1];
  assert.equal(second.link, "https://www.enter.co/segunda/");
  assert.equal(second.image, "https://cdn.enter.co/2.webp");
  assert.equal(second.publishedAt, null);
});

test("usa enclosures de imagen y descarta items sin link", () => {
  const items = parseFeed(RSS);
  assert.equal(items.length, 3);
  assert.equal(items[2].image, "https://cdn.enter.co/3.png");
});

test("lee entradas atom", () => {
  const [first, second] = parseFeed(ATOM);
  assert.equal(first.title, "Novedades & cambios");
  assert.equal(first.link, "https://devblogs.example.com/post-1");
  assert.equal(first.image, "https://devblogs.example.com/cover.jpg");
  assert.equal(first.excerpt, "Resumen atom");
  assert.equal(second.link, "https://devblogs.example.com/post-2");
  assert.equal(second.image, "https://devblogs.example.com/t.jpg");
  assert.equal(second.publishedAt?.toISOString(), "2026-09-29T10:00:00.000Z");
});

test("lee feeds rss 1.0 (rdf)", () => {
  const [item] = parseFeed(RDF);
  assert.equal(item.title, "Nota RDF");
  assert.equal(item.publishedAt?.toISOString(), "2026-09-28T08:00:00.000Z");
});

test("retorna vacio cuando el texto no es un feed", () => {
  assert.deepEqual(parseFeed("<!doctype html><html><body>Hola</body></html>"), []);
  assert.deepEqual(parseFeed("no es xml"), []);
});
