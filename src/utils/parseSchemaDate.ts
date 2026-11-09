import { EVENTS_TIME_ZONE } from "@/constants/events";
import { addDaysToKey } from "./addDaysToKey";
import { toIsoInZone } from "./toIsoInZone";

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const WITH_OFFSET = /(Z|[+-]\d{2}(:?\d{2})?)$/i;

/** `2026-02-30` o `25:00` no existen: `Date.UTC` los corre al dia o la hora siguiente en vez de fallar. */
function isRealDateTime(dayKey: string, time = "00:00"): boolean {
  const [year, month, day] = dayKey.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const sameDay = date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  return sameDay && hour < 24 && minute < 60;
}

export type SchemaDate = {
  /** Instante en ISO 8601 (UTC). */
  iso: string;
  /** Era solo una fecha, sin hora. */
  dateOnly: boolean;
};

/**
 * Fecha de schema.org (`startDate`) -> ISO en UTC. Acepta `2026-11-14`, `2026-11-14T20:00`,
 * `2026-11-14T20:00:00-05:00` y `...Z`. Sin zona se toma la hora de Colombia.
 * Con `endOfDay`, una fecha sin hora apunta al inicio del dia siguiente (fin exclusivo).
 */
export function parseSchemaDate(value: unknown, { endOfDay = false }: { endOfDay?: boolean } = {}): SchemaDate | null {
  if (typeof value !== "string") return null;
  const text = value.trim();

  if (DATE_ONLY.test(text)) {
    if (!isRealDateTime(text)) return null;
    const key = endOfDay ? addDaysToKey(text, 1) : text;
    const iso = toIsoInZone(`${key}T00:00`, EVENTS_TIME_ZONE);
    return iso ? { iso, dateOnly: true } : null;
  }

  if (WITH_OFFSET.test(text) && /\d[T ]\d/.test(text)) {
    // `+0500` -> `+05:00`, que es lo que todos los motores entienden.
    const normalized = text.replace(/([+-]\d{2})(\d{2})$/, "$1:$2").replace(/([+-]\d{2})$/, "$1:00");
    const ms = Date.parse(normalized);
    return Number.isFinite(ms) ? { iso: new Date(ms).toISOString(), dateOnly: false } : null;
  }

  const local = text.match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/);
  if (!local || !isRealDateTime(local[1], local[2])) return null;
  const iso = toIsoInZone(`${local[1]}T${local[2]}`, EVENTS_TIME_ZONE);
  return iso ? { iso, dateOnly: false } : null;
}
