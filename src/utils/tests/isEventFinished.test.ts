import assert from "node:assert/strict";
import test from "node:test";
import { isEventFinished } from "../isEventFinished";
import { makeEvent } from "./fixtures/makeEvent";

const START = Date.parse("2026-11-08T23:00:00.000Z");
const HOUR = 3_600_000;

test("sin fin se supone que dura 3 horas", () => {
  const event = makeEvent();
  assert.equal(isEventFinished(event, START + 2 * HOUR), false);
  assert.equal(isEventFinished(event, START + 3 * HOUR + 60_000), true);
});

test("con fin, termina cuando llega esa hora", () => {
  const event = makeEvent({ end: "2026-11-09T01:00:00.000Z" });
  assert.equal(isEventFinished(event, Date.parse("2026-11-09T00:59:00.000Z")), false);
  assert.equal(isEventFinished(event, Date.parse("2026-11-09T01:01:00.000Z")), true);
});

test("un evento de dia completo sin fin dura 24 horas", () => {
  const event = makeEvent({ allDay: true, start: "2026-11-08T05:00:00.000Z" });
  assert.equal(isEventFinished(event, Date.parse("2026-11-09T04:00:00.000Z")), false);
  assert.equal(isEventFinished(event, Date.parse("2026-11-09T05:01:00.000Z")), true);
});

test("uno que aun no empieza no ha terminado", () => {
  assert.equal(isEventFinished(makeEvent(), START - HOUR), false);
});
