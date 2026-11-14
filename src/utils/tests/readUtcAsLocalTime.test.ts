import assert from "node:assert/strict";
import test from "node:test";
import { readUtcAsLocalTime } from "../readUtcAsLocalTime";

test("cambia la marca UTC por la hora de Colombia sin mover la hora", () => {
  const node = { "@type": "Event", name: "Skate Market", startDate: "2026-11-14T10:00:00Z", endDate: "2026-11-14T21:00:00.000+00:00" };
  assert.deepEqual(readUtcAsLocalTime(node), {
    "@type": "Event",
    name: "Skate Market",
    startDate: "2026-11-14T10:00:00-05:00",
    endDate: "2026-11-14T21:00:00.000-05:00",
  });
});

test("deja igual las fechas sin hora, con otra zona o que no son texto", () => {
  const node = { startDate: "2026-11-14", endDate: "2026-11-14T21:00:00-05:00", doorTime: "2026-11-14T09:00:00Z" };
  assert.deepEqual(readUtcAsLocalTime(node), node);
  assert.deepEqual(readUtcAsLocalTime({ startDate: 5 }), { startDate: 5 });
});

test("no cambia el nodo original", () => {
  const node = { startDate: "2026-11-14T10:00:00Z" };
  readUtcAsLocalTime(node);
  assert.equal(node.startDate, "2026-11-14T10:00:00Z");
});
