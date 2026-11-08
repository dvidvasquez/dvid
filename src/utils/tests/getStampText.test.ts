import assert from "node:assert/strict";
import test from "node:test";
import { getStampText } from "../getStampText";

const S = " ";

test("conectando mientras falta el dato o la hora del navegador", () => {
  assert.equal(getStampText({ dataTime: null, error: false, fetchedAt: 0, now: 0 }), "Conectando…");
  assert.equal(getStampText({ dataTime: "2026-11-07T14:00", error: false, fetchedAt: 5000, now: 0 }), "Conectando…");
});

test("actualizado hace N minutos", () => {
  assert.equal(
    getStampText({ dataTime: "2026-11-07T14:00", error: false, fetchedAt: 1_000_000, now: 1_000_000 + 3 * 60_000 }),
    `Actualizado hace 3${S}min`,
  );
});

test("sin conexion con dato previo indica la hora del dato", () => {
  assert.equal(
    getStampText({ dataTime: "2026-11-07T14:15", error: true, fetchedAt: 1, now: 2 }),
    `Sin conexión, datos de las 2:15${S}p.${S}m.`,
  );
});

test("sin conexion y sin dato", () => {
  assert.equal(getStampText({ dataTime: null, error: true, fetchedAt: 0, now: 2 }), "No se pudo cargar el clima");
});
