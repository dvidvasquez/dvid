import assert from "node:assert/strict";
import test from "node:test";
import { repairBrokenDateTime } from "../repairBrokenDateTime";

test("toma los minutos de la hora visible cuando coincide con la hora de la fecha", () => {
  assert.equal(repairBrokenDateTime("2026-11-09UTC18:11:00", "Lun, Nov 9 06:30 PM Medellín"), "2026-11-09T18:30:00");
  assert.equal(repairBrokenDateTime("2026-11-11UTC19:11:00", "Mié, Nov 11 07:30 p. m. Pequeño Teatro"), "2026-11-11T19:30:00");
});

test("entiende las 12 de la noche y del mediodia", () => {
  assert.equal(repairBrokenDateTime("2026-11-09UTC00:11:00", "12:15 AM"), "2026-11-09T00:15:00");
  assert.equal(repairBrokenDateTime("2026-11-09UTC12:11:00", "12:45 PM"), "2026-11-09T12:45:00");
});

test("usa la primera hora del texto, que es la de inicio", () => {
  assert.equal(repairBrokenDateTime("2026-11-10UTC14:11:00", "02:00 PM - 08:00 PM"), "2026-11-10T14:00:00");
});

test("sin hora visible, deja los minutos en 00 si son el numero del mes", () => {
  assert.equal(repairBrokenDateTime("2026-11-06UTC20:11:00", "Campamento"), "2026-11-06T20:00:00");
});

test("si la hora visible no coincide, no se fia de ella", () => {
  assert.equal(repairBrokenDateTime("2026-11-06UTC20:11:00", "Abre 05:30 PM"), "2026-11-06T20:00:00");
  assert.equal(repairBrokenDateTime("2026-11-06UTC20:30:00", "Abre 05:45 PM"), "2026-11-06T20:30:00");
});

test("no toca fechas que estan bien formadas", () => {
  assert.equal(repairBrokenDateTime("2026-11-06T20:30:00-05:00", "08:00 PM"), "2026-11-06T20:30:00-05:00");
  assert.equal(repairBrokenDateTime("2026-11-06", "08:00 PM"), "2026-11-06");
  assert.equal(repairBrokenDateTime("", "08:00 PM"), "");
});
