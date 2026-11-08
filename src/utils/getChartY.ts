import { CHART_MARGIN } from "@/constants/chart";
import type { ChartScale } from "@/types/weather";

/** Posicion vertical (px) de un valor: `scale.max` queda arriba y `scale.min` en el eje. */
export function getChartY(value: number, scale: ChartScale, height: number): number {
  const span = scale.max - scale.min || 1;
  return CHART_MARGIN.top + ((scale.max - value) * (height - CHART_MARGIN.top - CHART_MARGIN.bottom)) / span;
}
