import { MAX_EVENT_SPAN_DAYS } from "@/constants/events";
import type { AgendaEvent } from "@/types/event";
import { addDaysToKey } from "./addDaysToKey";
import { toDayKey } from "./toDayKey";

const MINUTE_MS = 60_000;

/**
 * Los dias (`YYYY-MM-DD`, hora de Colombia) en que ocurre el evento, en orden.
 * Un fin justo a medianoche no cuenta como un dia mas; el tope evita listas enormes.
 */
export function getEventDayKeys(event: Pick<AgendaEvent, "start" | "end">): string[] {
  const first = toDayKey(event.start);
  if (!first) return [];

  const lastRaw = event.end ? toDayKey(Date.parse(event.end) - MINUTE_MS) : first;
  const last = lastRaw > first ? lastRaw : first;
  const keys = [first];

  for (let key = addDaysToKey(first, 1); key <= last && keys.length < MAX_EVENT_SPAN_DAYS; key = addDaysToKey(key, 1)) {
    keys.push(key);
  }
  return keys;
}
