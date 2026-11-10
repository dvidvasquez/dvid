import assert from "node:assert/strict";
import test from "node:test";
import { collectEmbeddedEvents } from "../collectEmbeddedEvents";

test("encuentra eventos con titulo y fecha en cualquier parte del JSON", () => {
  const data = { props: { pageProps: { events: [{ title: "Noche de metal", startDate: "2026-11-14T20:00:00-05:00" }] } } };
  assert.deepEqual(collectEmbeddedEvents([data]), [
    { "@type": "Event", name: "Noche de metal", startDate: "2026-11-14T20:00:00-05:00" },
  ]);
});

test("acepta nombres de campo en espanol, con guion bajo y en mayusculas", () => {
  const [event] = collectEmbeddedEvents([[{ Titulo: "Feria del libro", fecha_inicio: "2026-11-20", fecha_fin: "2026-11-30" }]]);
  assert.equal(event.name, "Feria del libro");
  assert.equal(event.startDate, "2026-11-20");
  assert.equal(event.endDate, "2026-11-30");
});

test("ignora objetos sin titulo, sin fecha o con una fecha que no se entiende", () => {
  const data = [{ title: "Sin fecha" }, { date: "2026-11-14" }, { title: "Fecha rara", date: "14 de noviembre" }, { title: "Mes falso", date: "2026-02-30" }];
  assert.deepEqual(collectEmbeddedEvents([data]), []);
});

test("un campo de fecha especifico gana al generico", () => {
  const [event] = collectEmbeddedEvents([{ title: "Concierto", date: "2025-01-01", startDate: "2026-12-01" }]);
  assert.equal(event.startDate, "2026-12-01");
});

test("suma la hora cuando la fecha viene sin hora", () => {
  const events = collectEmbeddedEvents([
    [
      { title: "Evento A", fecha: "2026-11-14", hora: "19:30" },
      { title: "Evento B", fecha: "2026-11-15", hora: "7:30 p. m." },
      { title: "Evento C", fecha: "2026-11-16", hora: "12:15 am" },
      { title: "Evento D", fecha: "2026-11-17", hora: "no hay" },
    ],
  ]);
  assert.deepEqual(events.map((event) => event.startDate), ["2026-11-14T19:30", "2026-11-15T19:30", "2026-11-16T00:15", "2026-11-17"]);
});

test("convierte fechas Unix en segundos y milisegundos", () => {
  const events = collectEmbeddedEvents([[{ title: "Evento S", start: 1794700800 }, { title: "Evento M", start: 1794700800000 }, { title: "Evento N", start: 42 }]]);
  assert.deepEqual(events.map((event) => event.startDate), ["2026-11-15T00:00:00.000Z", "2026-11-15T00:00:00.000Z"]);
});

test("lee imagen, enlace, lugar y descripcion en sus formas habituales", () => {
  const [event] = collectEmbeddedEvents([
    {
      title: { rendered: "Rock al parque" },
      date: "2026-11-14T18:00:00",
      image: { data: { attributes: { url: "https://cdn.test/a.jpg" } } },
      permalink: "/eventos/rock-al-parque",
      venue: { name: "Teatro Pablo Tobón", city: "Medellín", address: "Cra. 40" },
      excerpt: "Una noche de bandas locales.",
    },
  ]);
  assert.equal(event.name, "Rock al parque");
  assert.equal(event.image, "https://cdn.test/a.jpg");
  assert.equal(event.url, "/eventos/rock-al-parque");
  assert.deepEqual(event.location, { name: "Teatro Pablo Tobón", address: { streetAddress: "Cra. 40", addressLocality: "Medellín" } });
  assert.equal(event.description, "Una noche de bandas locales.");
});

test("el lugar puede ser solo un texto", () => {
  const [event] = collectEmbeddedEvents([{ name: "Jazz", start: "2026-11-14", lugar: "Parque Lleras" }]);
  assert.equal(event.location, "Parque Lleras");
});

test("el precio se toma en pesos y se descarta si viene en otra moneda", () => {
  const events = collectEmbeddedEvents([
    [
      { title: "Evento A", date: "2026-11-14", price: 50000 },
      { title: "Evento B", date: "2026-11-14", precio: "$80.000", currency: "COP" },
      { title: "Evento C", date: "2026-11-14", price: 30, currency: "USD" },
      { title: "Evento D", date: "2026-11-14", price: "Consultar" },
      { title: "Evento E", date: "2026-11-14", price: 5000, gratis: true },
    ],
  ]);
  assert.deepEqual(events.map((event) => event.offers), [
    { price: "50000", priceCurrency: "COP" },
    { price: "$80.000", priceCurrency: "COP" },
    undefined,
    undefined,
    undefined,
  ]);
  assert.equal(events[4].isAccessibleForFree, true);
});

test("cuenta una sola vez el mismo evento repetido y sigue adentro de los eventos", () => {
  const event = { title: "Techno", startDate: "2026-11-14T22:00:00-05:00" };
  const data = [{ events: [event, event] }, { title: "Agenda", date: "2026-11-01", items: [{ name: "Teatro", start: "2026-11-15" }] }];
  assert.deepEqual(
    collectEmbeddedEvents([data]).map((found) => found.name),
    ["Techno", "Agenda", "Teatro"],
  );
});

test("no se cuelga con JSON muy profundo", () => {
  let deep: unknown = { title: "Profundo", date: "2026-11-14" };
  for (let i = 0; i < 100; i += 1) deep = { child: deep };
  assert.deepEqual(collectEmbeddedEvents([deep]), []);
});

test("abre los textos que a su vez son JSON (calendario de Drupal)", () => {
  const options = JSON.stringify({ initialView: "dayGridMonth", events: [{ title: "Orquesta Sinfónica EAFIT", start: "2026-11-18T19:00:00", end: "2026-11-18T21:00:00", url: "/eventos/sinfonica" }] });
  const data = { fullCalendarView: [{ startField: "field_fecha", calendar_options: options }] };
  assert.deepEqual(collectEmbeddedEvents([data]), [
    { "@type": "Event", name: "Orquesta Sinfónica EAFIT", startDate: "2026-11-18T19:00:00", endDate: "2026-11-18T21:00:00", url: "/eventos/sinfonica" },
  ]);
});

test("un texto que parece JSON pero no lo es se ignora", () => {
  assert.deepEqual(collectEmbeddedEvents([{ nota: "{esto no es json, solo llaves y texto largo}" }]), []);
});
