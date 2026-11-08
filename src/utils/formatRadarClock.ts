import { CLIMA_UTC_OFFSET_HOURS } from "@/constants/climaPlaces";
import { formatHour } from "./formatHour";

/** Segundos desde epoch -> hora de Colombia (`2:30 p. m.`). */
export function formatRadarClock(epochSeconds: number): string {
  const local = new Date(epochSeconds * 1000 + CLIMA_UTC_OFFSET_HOURS * 3_600_000);
  return formatHour(local.getUTCHours(), local.getUTCMinutes());
}
