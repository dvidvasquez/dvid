import assert from "node:assert/strict";
import test from "node:test";
import { isInAgendaZone } from "../isInAgendaZone";

test("sin municipio se deja pasar", () => {
  assert.equal(isInAgendaZone(null), true);
  assert.equal(isInAgendaZone(""), true);
});

test("los municipios de la zona entran, con o sin tildes y mayusculas", () => {
  for (const place of ["Medellín", "ENVIGADO", "Itagüí", "La Estrella", "Rionegro", "El Carmen de Viboral", "Medellín, Antioquia"]) {
    assert.equal(isInAgendaZone(place), true, place);
  }
});

test("otras ciudades conocidas quedan fuera", () => {
  for (const place of ["Bogotá", "Bogotá D.C.", "Cali", "Barranquilla, Atlántico", "Cartagena de Indias", "Miami"]) {
    assert.equal(isInAgendaZone(place), false, place);
  }
});

test("si nombra la zona y otra ciudad, gana la zona", () => {
  assert.equal(isInAgendaZone("Medellín (gira que viene de Bogotá)"), true);
});

test("compara palabras completas", () => {
  assert.equal(isInAgendaZone("Caldas"), true);
  assert.equal(isInAgendaZone("California"), true);
  assert.equal(isInAgendaZone("Calima"), true);
});

test("un texto que no se reconoce (barrio, direccion) se deja pasar", () => {
  assert.equal(isInAgendaZone("El Poblado"), true);
  assert.equal(isInAgendaZone("Cra. 43A #7-50"), true);
});
