import assert from "node:assert/strict";
import test from "node:test";
import { getAgendaEmptyMessage } from "../getAgendaEmptyMessage";

test("si ninguna fuente respondio lo dice asi", () => {
  assert.match(getAgendaEmptyMessage([{ status: "error" }, { status: "error" }], 60), /ninguna fuente/);
  assert.match(getAgendaEmptyMessage([], 60), /ninguna fuente/);
});

test("si las fuentes respondieron pero estan vacias, no habla de fallos", () => {
  const message = getAgendaEmptyMessage([{ status: "sin-eventos" }, { status: "sin-eventos" }], 60);
  assert.match(message, /respondieron, pero no hay eventos en los próximos 60 días/);
  assert.doesNotMatch(message, /no respondi/);
});

test("avisa cuantas fuentes fallaron cuando el resto respondio", () => {
  assert.match(getAgendaEmptyMessage([{ status: "sin-eventos" }, { status: "error" }], 60), /Una fuente no respondió/);
  assert.match(
    getAgendaEmptyMessage([{ status: "sin-eventos" }, { status: "error" }, { status: "error" }], 30),
    /2 fuentes no respondieron/,
  );
});
