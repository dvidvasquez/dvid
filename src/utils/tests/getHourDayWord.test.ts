import assert from "node:assert/strict";
import test from "node:test";
import { getHourDayWord } from "../getHourDayWord";

test("mismo dia es Hoy, otro dia es Mañana", () => {
  assert.equal(getHourDayWord("2026-11-07T14:00", "2026-11-07T23:00"), "Hoy");
  assert.equal(getHourDayWord("2026-11-07T14:00", "2026-11-08T01:00"), "Mañana");
});
