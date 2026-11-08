import assert from "node:assert/strict";
import test from "node:test";
import { formatHour } from "../formatHour";

const S = " ";

test("formatea horas en formato de 12 horas con espacios duros", () => {
  assert.equal(formatHour(14), `2${S}p.${S}m.`);
  assert.equal(formatHour(9), `9${S}a.${S}m.`);
});

test("medianoche y mediodia son las 12", () => {
  assert.equal(formatHour(0), `12${S}a.${S}m.`);
  assert.equal(formatHour(12), `12${S}p.${S}m.`);
});

test("agrega los minutos con dos digitos solo si no son cero", () => {
  assert.equal(formatHour(14, 5), `2:05${S}p.${S}m.`);
  assert.equal(formatHour(14, 0), `2${S}p.${S}m.`);
});
