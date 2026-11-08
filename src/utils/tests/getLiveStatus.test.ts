import assert from "node:assert/strict";
import test from "node:test";
import { getLiveStatus } from "../getLiveStatus";

const MIN = 60_000;

test("al dia", () => {
  assert.equal(getLiveStatus({ error: false, fetchedAt: 1000, now: 1000 + 5 * MIN }), "live");
});

test("pasados 12 minutos queda desactualizado", () => {
  assert.equal(getLiveStatus({ error: false, fetchedAt: 1000, now: 1000 + 13 * MIN }), "stale");
});

test("un error manda sobre todo", () => {
  assert.equal(getLiveStatus({ error: true, fetchedAt: 1000, now: 1000 }), "error");
});

test("sin hora todavia se considera al dia", () => {
  assert.equal(getLiveStatus({ error: false, fetchedAt: 0, now: 0 }), "live");
  assert.equal(getLiveStatus({ error: false, fetchedAt: 5000, now: 0 }), "live");
});
