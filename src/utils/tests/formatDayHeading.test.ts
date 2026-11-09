import assert from "node:assert/strict";
import test from "node:test";
import { formatDayHeading } from "../formatDayHeading";

// 2026-11-08 es domingo.
const TODAY = "2026-11-08";

test("hoy", () => {
  assert.equal(formatDayHeading("2026-11-08", TODAY), "Hoy · domingo 8 de noviembre");
});

test("manana", () => {
  assert.equal(formatDayHeading("2026-11-09", TODAY), "Mañana · lunes 9 de noviembre");
});

test("otros dias llevan el dia de la semana con mayuscula", () => {
  assert.equal(formatDayHeading("2026-11-11", TODAY), "Miércoles 11 de noviembre");
  assert.equal(formatDayHeading("2026-12-05", TODAY), "Sábado 5 de diciembre");
});

test("manana cruza de mes", () => {
  assert.equal(formatDayHeading("2026-12-01", "2026-11-30"), "Mañana · martes 1 de diciembre");
});
