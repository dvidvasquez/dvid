import type { RadarFrame } from "@/types/weather";

/** Posicion del cuadro real mas reciente (el que se muestra al abrir); 0 si no hay. */
export function getLatestPastIndex(frames: readonly RadarFrame[]): number {
  let latest = 0;
  frames.forEach((frame, i) => {
    if (!frame.forecast) latest = i;
  });
  return latest;
}
