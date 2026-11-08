import type { ChartScale } from "@/types/weather";

/** Valores de las lineas guia, de `min` a `max`. Se multiplica en vez de acumular para no arrastrar error de decimales. */
export function getScaleTicks({ min, max, step }: ChartScale): number[] {
  const count = Math.round((max - min) / step);
  return Array.from({ length: count + 1 }, (_, i) => min + i * step);
}
