import assert from "node:assert/strict";
import test from "node:test";
import { filterEvents, type EventFilters } from "../filterEvents";
import { makeEvent } from "./fixtures/makeEvent";

const NONE: EventFilters = { categories: [], municipality: "", freeOnly: false, query: "" };

const events = [
  makeEvent({ id: "punk", title: "Noche Punk", category: "punk", venue: "El Sótano", municipality: "Bello", price: 0 }),
  makeEvent({ id: "tech", title: "Techno Night", category: "electronica", venue: "Club Átomo", price: 40000 }),
  makeEvent({ id: "obra", title: "El Principito", category: "teatro", venue: "Teatro Lido", municipality: null }),
];

const ids = (filters: Partial<EventFilters>) => filterEvents(events, { ...NONE, ...filters }).map(({ id }) => id);

test("sin filtros deja pasar todo", () => {
  assert.deepEqual(ids({}), ["punk", "tech", "obra"]);
});

test("filtra por una o varias categorias", () => {
  assert.deepEqual(ids({ categories: ["punk"] }), ["punk"]);
  assert.deepEqual(ids({ categories: ["punk", "teatro"] }), ["punk", "obra"]);
});

test("filtra por municipio sin importar tildes ni mayusculas", () => {
  assert.deepEqual(ids({ municipality: "bello" }), ["punk"]);
  assert.deepEqual(ids({ municipality: "MEDELLIN" }), ["tech"]);
});

test("solo gratis deja los de precio 0 y no los de precio desconocido", () => {
  assert.deepEqual(ids({ freeOnly: true }), ["punk"]);
});

test("la busqueda ignora tildes y exige todas las palabras", () => {
  assert.deepEqual(ids({ query: "atomo" }), ["tech"]);
  assert.deepEqual(ids({ query: "night techno" }), ["tech"]);
  assert.deepEqual(ids({ query: "night punk" }), []);
});

test("la busqueda tambien mira la categoria", () => {
  assert.deepEqual(ids({ query: "electronica" }), ["tech"]);
});

test("los filtros se combinan", () => {
  assert.deepEqual(ids({ categories: ["punk", "electronica"], freeOnly: true }), ["punk"]);
});
