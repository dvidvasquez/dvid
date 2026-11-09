import assert from "node:assert/strict";
import test from "node:test";
import { parseEventLocation } from "../parseEventLocation";

test("separa sitio y municipio de una direccion completa", () => {
  assert.deepEqual(parseEventLocation("Academia Musicreando, Carrera 10 #12-130, Medellín, Antioquia, Colombia"), {
    venue: "Academia Musicreando",
    municipality: "Medellín",
  });
});

test("quita el prefijo Private de los sitios privados", () => {
  assert.deepEqual(parseEventLocation("Private: La Pascasia, Calle 47 #43 88, Medellín, Antioquia, Colombia"), {
    venue: "La Pascasia",
    municipality: "Medellín",
  });
});

test("sin direccion, el municipio es el tramo anterior al departamento", () => {
  assert.deepEqual(parseEventLocation("Teatro Municipal, Bello, Antioquia"), {
    venue: "Teatro Municipal",
    municipality: "Bello",
  });
});

test("un tramo con numeros es una direccion, no un municipio", () => {
  assert.deepEqual(parseEventLocation("Plaza Mayor, Calle 41 #55-80"), { venue: "Plaza Mayor", municipality: null });
});

test("solo el sitio: sin municipio", () => {
  assert.deepEqual(parseEventLocation("Parque Arví"), { venue: "Parque Arví", municipality: null });
});

test("el pais y el departamento se comparan sin tildes ni mayusculas", () => {
  assert.deepEqual(parseEventLocation("Sala, Envigado, ANTIOQUIA, colombia"), { venue: "Sala", municipality: "Envigado" });
});

test("texto vacio", () => {
  assert.deepEqual(parseEventLocation(""), { venue: "", municipality: null });
});
