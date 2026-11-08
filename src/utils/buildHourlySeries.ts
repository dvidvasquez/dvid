import type { Forecast, HourlySeries } from "@/types/weather";

const SERIES_LENGTH = 25;

/** Hora actual + las 24 siguientes (si el pronostico las tiene). */
export function buildHourlySeries(forecast: Pick<Forecast, "current" | "hourly">): HourlySeries {
  const currentHour = `${forecast.current.time.slice(0, 13)}:00`;
  const found = forecast.hourly.findIndex((point) => point.time === currentHour);
  const startIndex = found < 0 ? 0 : found;
  return { startIndex, points: forecast.hourly.slice(startIndex, startIndex + SERIES_LENGTH) };
}
