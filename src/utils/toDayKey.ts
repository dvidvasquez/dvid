import { EVENTS_UTC_OFFSET_MINUTES } from "@/constants/events";

/** Instante (ms o ISO) -> dia `YYYY-MM-DD` en hora de Colombia. Vacio si la fecha no es valida. */
export function toDayKey(instant: string | number): string {
  const ms = typeof instant === "number" ? instant : Date.parse(instant);
  if (!Number.isFinite(ms)) return "";
  return new Date(ms + EVENTS_UTC_OFFSET_MINUTES * 60_000).toISOString().slice(0, 10);
}
