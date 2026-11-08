import type { Place, PlaceSnapshot } from "@/types/weather";
import { describeWeather } from "./describeWeather";

/** Linea para comparar la foto con el pronostico de la zona mas cercana. */
export function getWebcamForecastLine(place: Pick<Place, "name">, snapshot: PlaceSnapshot): string {
  return `Pronóstico en ${place.name}: ${snapshot.temperature}°, ${describeWeather(snapshot.code).label.toLowerCase()}`;
}
