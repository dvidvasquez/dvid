import assert from "node:assert/strict";
import test from "node:test";
import { extractMicrodata } from "../extractMicrodata";

const CARD = `
<div class="card" itemscope itemtype="http://schema.org/Event">
  <a itemprop="url" href="/index.php/agenda/las-troyanas"><img itemprop="image" src="/media/las_troyanas.webp" alt=""></a>
  <h3 itemprop="name">Las Troyanas &amp; m&aacute;s</h3>
  <meta itemprop="startDate" content="2026-11-11T19:30:00-05:00">
  <time itemprop="endDate" datetime="2026-11-14">14 nov</time>
  <div itemprop="location" itemscope itemtype="http://schema.org/Place">
    <span itemprop="name">Pequeño Teatro</span>
    <span itemprop="address" itemscope itemtype="http://schema.org/PostalAddress"><span itemprop="addressLocality">Medellín</span></span>
  </div>
  <p itemprop="description">Obra   de
    teatro</p>
</div>`;

test("lee las propiedades de un evento segun la etiqueta de cada una", () => {
  const [event] = extractMicrodata(CARD);
  assert.equal(event["@type"], "Event");
  assert.equal(event.name, "Las Troyanas & más");
  assert.equal(event.url, "/index.php/agenda/las-troyanas");
  assert.equal(event.image, "/media/las_troyanas.webp");
  assert.equal(event.startDate, "2026-11-11T19:30:00-05:00");
  assert.equal(event.endDate, "2026-11-14");
  assert.equal(event.description, "Obra de teatro");
});

test("lee los objetos anidados (lugar y direccion)", () => {
  const [event] = extractMicrodata(CARD);
  assert.deepEqual(event.location, {
    "@type": "Place",
    name: "Pequeño Teatro",
    address: { "@type": "PostalAddress", addressLocality: "Medellín" },
  });
});

test("saca un evento por cada itemscope, con su subtipo", () => {
  const html = `${CARD}<li itemscope itemtype="https://schema.org/MusicEvent"><b itemprop="name">Concierto</b></li>`;
  const events = extractMicrodata(html);
  assert.equal(events.length, 2);
  assert.equal(events[1]["@type"], "MusicEvent");
  assert.equal(events[1].name, "Concierto");
});

test("ignora lo que no es un evento", () => {
  const html = `<div itemscope itemtype="http://schema.org/Person"><span itemprop="name">Ana</span></div>
    <div itemscope itemtype="http://schema.org/Organization"></div>`;
  assert.deepEqual(extractMicrodata(html), []);
});

test("las propiedades de un objeto anidado no pasan al evento", () => {
  const html = `<div itemscope itemtype="http://schema.org/Event">
    <span itemprop="name">Show</span>
    <div itemprop="organizer" itemscope itemtype="http://schema.org/Organization"><span itemprop="name">Otro</span><span itemprop="url">/o</span></div>
  </div>`;
  const [event] = extractMicrodata(html);
  assert.equal(event.name, "Show");
  assert.equal(event.url, undefined);
  assert.deepEqual(event.organizer, { "@type": "Organization", name: "Otro", url: "/o" });
});

test("un evento dentro de otro no se cuenta aparte", () => {
  const html = `<div itemscope itemtype="http://schema.org/Event"><span itemprop="name">Festival</span>
    <div itemprop="subEvent" itemscope itemtype="http://schema.org/Event"><span itemprop="name">Dia 1</span></div></div>`;
  const events = extractMicrodata(html);
  assert.equal(events.length, 1);
  assert.equal(events[0].name, "Festival");
});

test("aguanta etiquetas sin cierre y vacias", () => {
  const html = `<ul><li itemscope itemtype="http://schema.org/Event"><span itemprop="name">Uno</span><br><input type="hidden">
    <li itemscope itemtype="http://schema.org/Event"><span itemprop="name">Dos</span></ul>`;
  assert.deepEqual(extractMicrodata(html).map((event) => event.name), ["Uno", "Dos"]);
});

test("no mira dentro de scripts, estilos ni comentarios", () => {
  const html = `<script>var x = '<div itemscope itemtype="http://schema.org/Event">';</script>
    <style>.a{}</style><!-- <div itemscope itemtype="http://schema.org/Event"></div> -->`;
  assert.deepEqual(extractMicrodata(html), []);
});

test("arregla las fechas rotas de Infolocal con la hora visible del evento", () => {
  const html = `<div itemscope itemtype="http://schema.org/Event">
    <a itemprop="url" href="/index.php/agenda/pgv-trio"></a>
    <h3 itemprop="name">PGV Trío</h3>
    <span itemprop="startDate" style="display:none">2026-11-06UTC20:11:00</span>
    <span itemprop="endDate" style="display:none">2026-11-06</span>
    <span>Vie, Nov 6</span> <span>08:00 PM</span>
  </div>`;
  const [event] = extractMicrodata(html);
  assert.equal(event.startDate, "2026-11-06T20:00:00");
  assert.equal(event.endDate, "2026-11-06");
});

test("sin microdatos da una lista vacia", () => {
  assert.deepEqual(extractMicrodata("<html><body><p>Hola</p></body></html>"), []);
  assert.deepEqual(extractMicrodata(""), []);
});
