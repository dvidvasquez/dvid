import { parseLocalTime } from "./parseLocalTime";

/** Cuanto se adelanta la hora local de `timeZone` respecto a UTC en ese instante (ms). */
function getZoneOffsetMs(utcMs: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).formatToParts(new Date(utcMs));
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return asUtc - Math.floor(utcMs / 1000) * 1000;
}

/**
 * Hora de pared (`YYYY-MM-DDTHH:mm`) en una zona IANA -> ISO 8601 en UTC.
 * Da `null` si la fecha o la zona no son validas.
 */
export function toIsoInZone(local: string, timeZone: string): string | null {
  const { year, month, day, hour, minute } = parseLocalTime(local);
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  if (!Number.isFinite(guess)) return null;

  try {
    const first = guess - getZoneOffsetMs(guess, timeZone);
    const second = guess - getZoneOffsetMs(first, timeZone);
    return new Date(second).toISOString();
  } catch {
    return null;
  }
}
