import { CHART_MARGIN } from "@/constants/chart";

/** Posicion horizontal (px) del punto `index` de `count` en una grafica de ancho `width`. */
export function getChartX(index: number, width: number, count: number): number {
  if (count < 2) return CHART_MARGIN.left;
  return CHART_MARGIN.left + (index * (width - CHART_MARGIN.left - CHART_MARGIN.right)) / (count - 1);
}
