import { CLIMA_TIMEZONE } from "@/constants/climaPlaces";
import type { Place } from "@/types/weather";

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

/** Pronostico completo (ahora, 7 dias y por horas) de un lugar. */
export function buildForecastUrl(place: Pick<Place, "lat" | "lon">): string {
  const params = new URLSearchParams({
    latitude: String(place.lat),
    longitude: String(place.lon),
    timezone: CLIMA_TIMEZONE,
    forecast_days: "7",
    wind_speed_unit: "kmh",
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m",
    hourly: "temperature_2m,precipitation_probability,precipitation,weather_code",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,sunrise,sunset,uv_index_max",
  });
  return `${OPEN_METEO_URL}?${params}`;
}
