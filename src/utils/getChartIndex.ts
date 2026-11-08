import { CHART_MARGIN } from "@/constants/chart";

/** Posicion horizontal (px dentro del SVG) -> indice del punto mas cercano. */
export function getChartIndex(x: number, width: number, count: number): number {
  if (count < 2) return 0;
  const slot = (width - CHART_MARGIN.left - CHART_MARGIN.right) / (count - 1);
  const index = Math.round((x - CHART_MARGIN.left) / slot);
  return Math.max(0, Math.min(count - 1, index));
}
