import assert from "node:assert/strict";
import test from "node:test";
import { collectJsonLdEvents, type JsonLdNode } from "../collectJsonLdEvents";
import { extractJsonLd } from "../extractJsonLd";
import { jsonLdToAgendaEvent } from "../jsonLdToAgendaEvent";
import { ARRAY_PAGE, ITEM_LIST_PAGE } from "./fixtures/jsonLdPages";

const SOURCE = { nombre: "Songkick", url: "https://www.songkick.com/metro-areas/28331-colombia-medellin" };
const PAGE = SOURCE.url;

const RAW: JsonLdNode = {
  "@type": "MusicEvent",
  name: "Hocico &amp; Friends",
  description: "<p>Industrial y EBM en vivo.</p>",
  startDate: "2026-11-22T21:00:00-05:00",
  endDate: "2026-11-23T02:00:00-05:00",
  url: "https://www.songkick.com/concerts/2-hocico",
  image: { "@type": "ImageObject", url: "https://images.example.com/hocico.jpg" },
  location: {
    "@type": "Place",
    name: "Green Club",
    address: { "@type": "PostalAddress", streetAddress: "Calle 10 # 40-20", addressLocality: "Medellín" },
  },
  offers: { "@type": "Offer", price: "80000", priceCurrency: "COP" },
};

test("convierte un evento de schema.org", () => {
  assert.deepEqual(jsonLdToAgendaEvent(RAW, SOURCE, PAGE), {
    id: "https://www.songkick.com/concerts/2-hocico",
    title: "Hocico & Friends",
    category: "musica",
    start: "2026-11-23T02:00:00.000Z",
    end: "2026-11-23T07:00:00.000Z",
    allDay: false,
    venue: "Green Club",
    municipality: "Medellín",
    price: 80000,
    image: "https://images.example.com/hocico.jpg",
    excerpt: "Industrial y EBM en vivo.",
    source: "Songkick",
    url: "https://www.songkick.com/concerts/2-hocico",
  });
});

test("completa las URLs relativas con la pagina de origen", () => {
  const [first] = collectJsonLdEvents(extractJsonLd(ARRAY_PAGE));
  const event = jsonLdToAgendaEvent(first, SOURCE, "https://www.songkick.com/metro-areas/28331-colombia-medellin");
  assert.equal(event?.url, "https://www.songkick.com/concerts/1-kampfar");
  assert.equal(event?.image, "https://images.example.com/kampfar.jpg");
  assert.equal(event?.venue, "Estadio Atanasio Girardot");
});

test("un evento sin lugar, imagen ni precio sigue siendo valido", () => {
  const event = jsonLdToAgendaEvent({ "@type": "Event", name: "Algo", startDate: "2026-12-01T19:00:00-05:00" }, SOURCE, PAGE);
  assert.equal(event?.venue, "");
  assert.equal(event?.municipality, null);
  assert.equal(event?.image, null);
  assert.equal(event?.price, null);
  assert.equal(event?.url, SOURCE.url);
  assert.equal(event?.id, "Songkick|Algo|2026-12-02T00:00:00.000Z");
});

test("un evento de varios dias sin hora es de dia completo y su fin queda al inicio del dia siguiente", () => {
  const raw = collectJsonLdEvents(extractJsonLd(ITEM_LIST_PAGE))[0];
  const event = jsonLdToAgendaEvent(raw, SOURCE, PAGE);
  assert.equal(event?.allDay, true);
  assert.equal(event?.start, "2026-11-28T05:00:00.000Z");
  assert.equal(event?.end, "2026-11-30T05:00:00.000Z");
  assert.equal(event?.price, 0);
  assert.equal(event?.category, "feria");
});

test("el precio es el minimo de las ofertas en pesos y una moneda distinta no se convierte", () => {
  const offers = [
    { price: "120000", priceCurrency: "COP" },
    { lowPrice: "45000", priceCurrency: "COP" },
  ];
  assert.equal(jsonLdToAgendaEvent({ ...RAW, offers }, SOURCE, PAGE)?.price, 45000);
  assert.equal(jsonLdToAgendaEvent({ ...RAW, offers: { price: "25", priceCurrency: "USD" } }, SOURCE, PAGE)?.price, null);
  assert.equal(jsonLdToAgendaEvent({ ...RAW, offers: { price: "60000" } }, SOURCE, PAGE)?.price, 60000);
  assert.equal(jsonLdToAgendaEvent({ ...RAW, offers: undefined, isAccessibleForFree: true }, SOURCE, PAGE)?.price, 0);
});

test("la categoria sale del titulo y de los generos; sin pistas usa el tipo o la pista de la fuente", () => {
  assert.equal(jsonLdToAgendaEvent({ ...RAW, name: "Noche de Black Metal" }, SOURCE, PAGE)?.category, "metal");
  assert.equal(jsonLdToAgendaEvent({ ...RAW, name: "Hocico", genre: ["Punk"] }, SOURCE, PAGE)?.category, "punk");
  assert.equal(jsonLdToAgendaEvent({ ...RAW, name: "Kampfar", "@type": "TheaterEvent" }, SOURCE, PAGE)?.category, "teatro");
  assert.equal(jsonLdToAgendaEvent({ ...RAW, name: "Kampfar", "@type": "Event" }, SOURCE, PAGE)?.category, "otro");
  assert.equal(
    jsonLdToAgendaEvent({ ...RAW, name: "Kampfar", "@type": "Event" }, { ...SOURCE, categoryHint: "metal" }, PAGE)?.category,
    "metal",
  );
});

test("la pista de genero de la fuente afina un concierto generico pero no pisa un genero claro", () => {
  const source = { ...SOURCE, categoryHint: "rock" as const };
  assert.equal(jsonLdToAgendaEvent({ ...RAW, name: "Gran concierto" }, source, PAGE)?.category, "rock");
  assert.equal(jsonLdToAgendaEvent({ ...RAW, name: "Noche Punk" }, source, PAGE)?.category, "punk");
  assert.equal(jsonLdToAgendaEvent({ ...RAW, name: "Hamlet", "@type": "TheaterEvent" }, source, PAGE)?.category, "teatro");
});

test("descarta lo cancelado, lo aplazado y lo que es solo en linea", () => {
  assert.equal(jsonLdToAgendaEvent({ ...RAW, eventStatus: "https://schema.org/EventCancelled" }, SOURCE, PAGE), null);
  assert.equal(jsonLdToAgendaEvent({ ...RAW, eventStatus: "https://schema.org/EventPostponed" }, SOURCE, PAGE), null);
  assert.equal(
    jsonLdToAgendaEvent({ ...RAW, eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode" }, SOURCE, PAGE),
    null,
  );
  assert.notEqual(jsonLdToAgendaEvent({ ...RAW, eventStatus: "https://schema.org/EventRescheduled" }, SOURCE, PAGE), null);
});

test("solo deja pasar URLs https", () => {
  const event = jsonLdToAgendaEvent(
    { ...RAW, url: "http://example.com/e", image: ["javascript:alert(1)", "http://example.com/a.jpg", "https://ok.example.com/a.jpg"] },
    SOURCE,
    PAGE,
  );
  assert.equal(event?.url, SOURCE.url);
  assert.equal(event?.image, "https://ok.example.com/a.jpg");
});

test("el lugar puede venir como texto, en una lista o con la direccion como texto", () => {
  assert.equal(jsonLdToAgendaEvent({ ...RAW, location: "Teatro Pablo Tobón" }, SOURCE, PAGE)?.venue, "Teatro Pablo Tobón");
  assert.equal(jsonLdToAgendaEvent({ ...RAW, location: [{ name: "Sala A" }, { name: "Sala B" }] }, SOURCE, PAGE)?.venue, "Sala A");
  assert.equal(jsonLdToAgendaEvent({ ...RAW, location: { address: "Cra 40 # 51-24, Medellín" } }, SOURCE, PAGE)?.venue, "Cra 40 # 51-24, Medellín");
});

test("el fin igual o anterior al inicio se ignora", () => {
  assert.equal(jsonLdToAgendaEvent({ ...RAW, endDate: RAW.startDate }, SOURCE, PAGE)?.end, null);
  assert.equal(jsonLdToAgendaEvent({ ...RAW, endDate: "2026-11-22T10:00:00-05:00" }, SOURCE, PAGE)?.end, null);
});

test("sin titulo o sin fecha de inicio valida no hay evento", () => {
  assert.equal(jsonLdToAgendaEvent({ ...RAW, name: "" }, SOURCE, PAGE), null);
  assert.equal(jsonLdToAgendaEvent({ ...RAW, startDate: undefined }, SOURCE, PAGE), null);
  assert.equal(jsonLdToAgendaEvent({ ...RAW, startDate: "pronto" }, SOURCE, PAGE), null);
});
