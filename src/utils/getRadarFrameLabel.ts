import { NBSP } from "@/constants/text";
import type { RadarFrame } from "@/types/weather";
import { formatRadarClock } from "./formatRadarClock";

/** `Radar de las 2:30 p. m. (hace 5 min)`; los cuadros de pronostico dicen `(pronóstico)`. */
export function getRadarFrameLabel(frame: RadarFrame, now: number): string {
  const minutes = Math.round((now - frame.time * 1000) / 60000);
  const when = frame.forecast ? "pronóstico" : minutes <= 1 ? "ahora" : `hace ${minutes}${NBSP}min`;
  return `Radar de las ${formatRadarClock(frame.time)} (${when})`;
}
