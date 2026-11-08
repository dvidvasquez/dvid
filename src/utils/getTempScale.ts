import type { ChartScale } from "@/types/weather";

/** Escala del eje de temperatura: un grado de aire arriba y abajo, con pasos de 1, 2 o 5. */
export function getTempScale(temps: readonly number[]): ChartScale {
  const low = Math.min(...temps);
  const high = Math.max(...temps);
  const range = high - low + 2;
  const step = range <= 6 ? 1 : range <= 12 ? 2 : 5;
  return {
    min: Math.floor((low - 1) / step) * step,
    max: Math.ceil((high + 1) / step) * step,
    step,
  };
}
