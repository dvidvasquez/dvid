const POINTS = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];

/** Grados de donde viene el viento -> punto cardinal (`N`, `NE`, ... `NO`). */
export function getCompassPoint(degrees: number): string {
  const index = Math.round(degrees / 45) % 8;
  return POINTS[(index + 8) % 8];
}
