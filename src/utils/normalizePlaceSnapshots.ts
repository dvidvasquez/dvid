import type { Place, PlaceSnapshots } from "@/types/weather";
import { isRainingNow } from "./isRainingNow";
import { toFiniteNumber } from "./toFiniteNumber";

/**
 * La consulta de varios puntos de Open-Meteo devuelve un arreglo en el mismo orden que
 * las coordenadas pedidas. Se arma un resumen por lugar; los que vengan incompletos se omiten.
 */
export function normalizePlaceSnapshots(input: unknown, places: readonly Place[]): PlaceSnapshots {
  const snapshots: PlaceSnapshots = {};
  if (!Array.isArray(input)) return snapshots;
  places.forEach((place, i) => {
    const entry: unknown = input[i];
    const current = entry !== null && typeof entry === "object" ? (entry as { current?: unknown }).current : null;
    if (current === null || typeof current !== "object") return;
    const raw = current as Record<string, unknown>;
    const temperature = toFiniteNumber(raw.temperature_2m);
    if (temperature === null) return;
    const code = toFiniteNumber(raw.weather_code, -1);
    snapshots[place.id] = {
      temperature: Math.round(temperature),
      wet: isRainingNow(toFiniteNumber(raw.precipitation, 0), code),
      code,
    };
  });
  return snapshots;
}
