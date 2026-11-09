import assert from "node:assert/strict";
import test from "node:test";
import { getEventDayKeys } from "../getEventDayKeys";
import { makeEvent } from "./fixtures/makeEvent";

test("un evento sin fin ocurre un solo dia", () => {
  assert.deepEqual(getEventDayKeys(makeEvent()), ["2026-11-08"]);
});

test("pasada la medianoche cuenta el dia siguiente", () => {
  // 6 p. m. del 8 hasta las 2 a. m. del 9 (hora de Medellin).
  const event = makeEvent({ end: "2026-11-09T07:00:00.000Z" });
  assert.deepEqual(getEventDayKeys(event), ["2026-11-08", "2026-11-09"]);
});

test("un evento de varios dias lista cada dia", () => {
  const event = makeEvent({ start: "2025-08-23T13:00:00.000Z", end: "2025-08-24T22:00:00.000Z" });
  assert.deepEqual(getEventDayKeys(event), ["2025-08-23", "2025-08-24"]);
});

test("terminar justo a medianoche no suma un dia", () => {
  const event = makeEvent({ end: "2026-11-09T05:00:00.000Z" });
  assert.deepEqual(getEventDayKeys(event), ["2026-11-08"]);
});

test("pone un tope a los eventos larguisimos", () => {
  const event = makeEvent({ end: "2026-12-20T05:00:00.000Z" });
  const keys = getEventDayKeys(event);
  assert.equal(keys.length, 14);
  assert.equal(keys[0], "2026-11-08");
  assert.equal(keys[13], "2026-11-21");
});

test("un fin anterior al inicio se ignora", () => {
  const event = makeEvent({ end: "2026-11-01T00:00:00.000Z" });
  assert.deepEqual(getEventDayKeys(event), ["2026-11-08"]);
});

test("un inicio invalido no tiene dias", () => {
  assert.deepEqual(getEventDayKeys(makeEvent({ start: "pronto" })), []);
});
