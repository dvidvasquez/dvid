import assert from "node:assert/strict";
import test from "node:test";
import { getDayLabel } from "../getDayLabel";

test("el primer dia es Hoy", () => {
  assert.equal(getDayLabel("2026-11-07", 0), "Hoy");
});

test("los demas llevan dia de la semana y numero", () => {
  // 2026-11-08 es domingo; 2026-11-09 es lunes.
  assert.equal(getDayLabel("2026-11-08", 1), "Dom 8");
  assert.equal(getDayLabel("2026-11-09", 2), "Lun 9");
  assert.equal(getDayLabel("2026-11-11", 4), "Mié 11");
});
