import assert from "node:assert/strict";
import test from "node:test";
import { countActiveFilters } from "../countActiveFilters";
import { NO_EVENT_FILTERS } from "../filterEvents";

test("sin filtros es cero", () => {
  assert.equal(countActiveFilters(NO_EVENT_FILTERS), 0);
});

test("varias categorias cuentan como un solo filtro", () => {
  assert.equal(countActiveFilters({ ...NO_EVENT_FILTERS, categories: ["punk", "metal", "rock"] }), 1);
});

test("cada tipo de filtro suma uno", () => {
  assert.equal(
    countActiveFilters({ categories: ["punk"], municipality: "Bello", freeOnly: true, query: "noche" }),
    4,
  );
});

test("un texto de solo espacios no cuenta", () => {
  assert.equal(countActiveFilters({ ...NO_EVENT_FILTERS, query: "   " }), 0);
});
