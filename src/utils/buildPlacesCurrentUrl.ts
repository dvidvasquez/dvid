import { CLIMA_TIMEZONE } from "@/constants/climaPlaces";
import type { Place } from "@/types/weather";

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

/** Una sola consulta con la temperatura actual de todos los lugares (para las burbujas del mapa). */
export function buildPlacesCurrentUrl(places: readonly Pick<Place, "lat" | "lon">[]): string {
  const params = new URLSearchParams({
    latitude: places.map((p) => p.lat).join(","),
    longitude: places.map((p) => p.lon).join(","),
    timezone: CLIMA_TIMEZONE,
    current: "temperature_2m,precipitation,weather_code",
  });
  return `${OPEN_METEO_URL}?${params}`;
}
