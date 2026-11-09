import assert from "node:assert/strict";
import test from "node:test";
import { collectJsonLdEvents } from "../collectJsonLdEvents";
import { extractJsonLd } from "../extractJsonLd";
import { ARRAY_PAGE, GRAPH_PAGE, ITEM_LIST_PAGE } from "./fixtures/jsonLdPages";

const names = (html: string) => collectJsonLdEvents(extractJsonLd(html)).map((node) => node.name);

test("junta los eventos de un arreglo y descarta los demas nodos", () => {
  assert.deepEqual(names(ARRAY_PAGE), ["Kampfar", "Hocico"]);
});

test("entra a las listas ItemList -> ListItem -> item", () => {
  assert.deepEqual(names(ITEM_LIST_PAGE), ["Festival de la Empanada", "Hamlet"]);
});

test("entra a @graph y acepta @type como lista", () => {
  assert.deepEqual(names(GRAPH_PAGE), ["Noche Punk"]);
});

test("reconoce los subtipos de Event y Festival, con o sin URL de schema.org", () => {
  const nodes = [
    { "@type": "MusicEvent", name: "a" },
    { "@type": "https://schema.org/TheaterEvent", name: "b" },
    { "@type": "Festival", name: "c" },
    { "@type": "Product", name: "d" },
    { "@type": "EventSeries", name: "e" },
  ];
  assert.deepEqual(collectJsonLdEvents(nodes).map((node) => node.name), ["a", "b", "c"]);
});

test("un evento no se recorre por dentro: sus subEvent no se repiten", () => {
  const nodes = [{ "@type": "Event", name: "Festival", subEvent: [{ "@type": "Event", name: "Dia 1" }] }];
  assert.deepEqual(collectJsonLdEvents(nodes).map((node) => node.name), ["Festival"]);
});

test("valores inesperados no rompen nada", () => {
  assert.deepEqual(collectJsonLdEvents([null, "texto", 4, [], {}]), []);
});

test("un anidado demasiado profundo se corta", () => {
  let nested: unknown = { "@type": "Event", name: "Hondo" };
  for (let i = 0; i < 20; i += 1) nested = { "@graph": nested };
  assert.deepEqual(collectJsonLdEvents([nested]), []);
});
