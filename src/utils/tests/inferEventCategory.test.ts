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

test("reconoce mas subgeneros en el titulo", () => {
  assert.equal(inferEventCategory({ title: "Noche de Metalcore y Deathcore" }), "metal");
  assert.equal(inferEventCategory({ title: "Punkrock para todos" }), "punk");
  assert.equal(inferEventCategory({ title: "Psytrance en la montaña" }), "electronica");
  assert.equal(inferEventCategory({ title: "Drum & Bass Sessions" }), "electronica");
  assert.equal(inferEventCategory({ title: "Stoner y psicodelia" }), "rock");
  assert.equal(inferEventCategory({ title: "Dancehall Night" }), "urbano");
});

test("una banda o festival local conocido da el genero", () => {
  assert.equal(inferEventCategory({ title: "Kraken: 40 años" }), "metal");
  assert.equal(inferEventCategory({ title: "Los Suziox + invitados" }), "punk");
  assert.equal(inferEventCategory({ title: "Festival Internacional Altavoz" }), "rock");
  assert.equal(inferEventCategory({ title: "Feid en concierto" }), "urbano");
});

test("los nombres se buscan completos, no como trozo de palabra", () => {
  assert.equal(inferEventCategory({ title: "Taller de feidad y sechura" }), "otro");
});

test("un sitio dedicado a un genero afina lo que quedo en musica u otro", () => {
  assert.equal(inferEventCategory({ title: "Viernes: Line up sorpresa", venue: "Salón Amador" }), "electronica");
  assert.equal(inferEventCategory({ title: "Concierto de aniversario", venue: "Sonorama Club" }), "electronica");
});

test("el sitio no cambia una categoria que ya es clara", () => {
  assert.equal(inferEventCategory({ title: "Obra de teatro: Hamlet", venue: "Salón Amador" }), "teatro");
  assert.equal(inferEventCategory({ title: "Noche de punk", venue: "Salón Amador" }), "punk");
});
