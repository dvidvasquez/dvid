import assert from "node:assert/strict";
import test from "node:test";
import { inferEventCategory } from "../inferEventCategory";

test("los dos eventos reales de Medellin Guru son musica", () => {
  assert.equal(
    inferEventCategory({
      title: "Pianotón 2025 - Classic Music Concert",
      categories: ["Concerts", "Culture", "Music festivals", "Musical"],
    }),
    "musica",
  );
  assert.equal(
    inferEventCategory({ title: "Heaven and Hell Symphony Fest", categories: ["Concerts", "Music festivals", "Musical"] }),
    "musica",
  );
});

test("reconoce el genero por el titulo", () => {
  assert.equal(inferEventCategory({ title: "Noche Punk en el Barrio" }), "punk");
  assert.equal(inferEventCategory({ title: "Medellín Metal Fest" }), "metal");
  assert.equal(inferEventCategory({ title: "Rock al Parque Medellín" }), "rock");
  assert.equal(inferEventCategory({ title: "Techno Night" }), "electronica");
  assert.equal(inferEventCategory({ title: "Reggaetón Party" }), "urbano");
});

test("el genero gana aunque el evento este en un teatro", () => {
  assert.equal(inferEventCategory({ title: "Hardcore en el Teatro" }), "punk");
});

test("las palabras no se buscan dentro de otras", () => {
  assert.equal(inferEventCategory({ title: "Tour Rockefeller" }), "otro");
  assert.equal(inferEventCategory({ title: "Rapunzel para niños" }), "otro");
});

test("teatro por titulo o por categoria", () => {
  assert.equal(inferEventCategory({ title: "La Casa de Bernarda Alba", categories: ["Theater"] }), "teatro");
  assert.equal(inferEventCategory({ title: "Obra: El Principito" }), "teatro");
});

test("un festival gastronomico es feria, aunque la fuente lo ponga en conciertos", () => {
  assert.equal(inferEventCategory({ title: "Festival de la Empanada" }), "feria");
  assert.equal(inferEventCategory({ title: "Feria de las Flores", categories: ["Concerts"] }), "feria");
});

test("un festival con palabras de musica en el titulo es musica", () => {
  assert.equal(inferEventCategory({ title: "Festival Internacional de Jazz" }), "musica");
});

test("la descripcion afina el genero solo cuando ya es un concierto", () => {
  assert.equal(
    inferEventCategory({ title: "Concierto de sábado", description: "Banda de thrash metal de Bogotá." }),
    "metal",
  );
  assert.equal(
    inferEventCategory({ title: "Clase de yoga", description: "Con música de rock suave." }),
    "otro",
  );
});

test("sin ninguna pista es otro", () => {
  assert.equal(inferEventCategory({ title: "Taller de cerámica" }), "otro");
});
