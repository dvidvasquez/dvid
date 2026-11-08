import { buildLinePath, type ChartPoint } from "./buildLinePath";

/** Cierra la linea hasta la base de la grafica para rellenar el area bajo la curva. */
export function buildAreaPath(points: readonly ChartPoint[], baselineY: number): string {
  if (points.length === 0) return "";
  const first = points[0];
  const last = points[points.length - 1];
  return `${buildLinePath(points)}L${last.x.toFixed(1)} ${baselineY.toFixed(1)}L${first.x.toFixed(1)} ${baselineY.toFixed(1)}Z`;
}
