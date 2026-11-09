import assert from "node:assert/strict";
import test from "node:test";
import { NBSP } from "@/constants/text";
import { formatEventTime } from "../formatEventTime";
import { makeEvent } from "./fixtures/makeEvent";

test("muestra la hora de Colombia, no la de UTC", () => {
  assert.equal(formatEventTime(makeEvent({ start: "2026-11-08T23:00:00.000Z" })), `6${NBSP}p.${NBSP}m.`);
});

test("agrega los minutos cuando no son cero", () => {
  assert.equal(formatEventTime(makeEvent({ start: "2026-11-09T01:30:00.000Z" })), `8:30${NBSP}p.${NBSP}m.`);
});

test("pasada la medianoche local es de la madrugada", () => {
  assert.equal(formatEventTime(makeEvent({ start: "2026-11-09T05:00:00.000Z" })), `12${NBSP}a.${NBSP}m.`);
});

test("los eventos de dia completo no llevan hora", () => {
  assert.equal(formatEventTime(makeEvent({ allDay: true })), "Todo el día");
});

test("un inicio invalido da texto vacio", () => {
  assert.equal(formatEventTime(makeEvent({ start: "pronto" })), "");
});
