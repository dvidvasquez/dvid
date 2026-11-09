import assert from "node:assert/strict";
import test from "node:test";
import { getQuickRange } from "../getQuickRange";

// 2026-11-08 es domingo.
const SUNDAY = "2026-11-08";

test("hoy y manana", () => {
  assert.deepEqual(getQuickRange("today", SUNDAY), { from: "2026-11-08", to: "2026-11-08" });
  assert.deepEqual(getQuickRange("tomorrow", SUNDAY), { from: "2026-11-09", to: "2026-11-09" });
});

test("7 dias incluye hoy y los 6 siguientes", () => {
  assert.deepEqual(getQuickRange("week", SUNDAY), { from: "2026-11-08", to: "2026-11-14" });
});

test("30 dias cruza de mes", () => {
  assert.deepEqual(getQuickRange("month", SUNDAY), { from: "2026-11-08", to: "2026-12-07" });
});

test("entre semana, el fin de semana es el sabado y domingo que vienen", () => {
  assert.deepEqual(getQuickRange("weekend", "2026-11-09"), { from: "2026-11-14", to: "2026-11-15" });
  assert.deepEqual(getQuickRange("weekend", "2026-11-13"), { from: "2026-11-14", to: "2026-11-15" });
});

test("un sabado, el fin de semana empieza hoy", () => {
  assert.deepEqual(getQuickRange("weekend", "2026-11-14"), { from: "2026-11-14", to: "2026-11-15" });
});

test("un domingo, el fin de semana es solo hoy", () => {
  assert.deepEqual(getQuickRange("weekend", SUNDAY), { from: "2026-11-08", to: "2026-11-08" });
});
