import { NBSP } from "@/constants/text";
import type { CurrentConditions, HourlyPoint } from "@/types/weather";
import { formatLocalTime } from "./formatLocalTime";
import { isRainingNow } from "./isRainingNow";

/**
 * Frase corta sobre la lluvia de las proximas horas.
 * `startIndex` es la posicion de la hora actual dentro de `hourly`.
 */
export function getRainOutlook(
  current: Pick<CurrentConditions, "precipitation" | "code">,
  hourly: readonly HourlyPoint[],
  startIndex: number,
): string {
  if (isRainingNow(current.precipitation, current.code)) {
    for (let k = 1; k <= 6; k += 1) {
      const point = hourly[startIndex + k];
      if (point && point.precipitation < 0.1 && point.precipProbability < 40) {
        return `Está lloviendo. Podría escampar hacia las ${formatLocalTime(point.time)}`;
      }
    }
    return "Está lloviendo y seguiría así las próximas 6 horas";
  }

  for (let k = 1; k <= 8; k += 1) {
    const point = hourly[startIndex + k];
    if (!point) break;
    if (point.precipitation >= 0.2 || point.precipProbability >= 60) {
      return `Lluvia probable hacia las ${formatLocalTime(point.time)} (${point.precipProbability}${NBSP}% de probabilidad)`;
    }
  }
  return "Sin lluvia prevista en las próximas 8 horas";
}
