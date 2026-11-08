import type { CurrentConditions, DailyPoint, Forecast, HourlyPoint } from "@/types/weather";
import { toFiniteNumber } from "./toFiniteNumber";

type Raw = Record<string, unknown>;

function asRecord(value: unknown): Raw | null {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? (value as Raw) : null;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value !== "" ? value : null;
}

function normalizeCurrent(input: unknown): CurrentConditions | null {
  const raw = asRecord(input);
  if (!raw) return null;
  const time = asString(raw.time);
  const temperature = toFiniteNumber(raw.temperature_2m);
  if (!time || temperature === null) return null;
  return {
    time,
    temperature,
    apparent: toFiniteNumber(raw.apparent_temperature, temperature),
    humidity: toFiniteNumber(raw.relative_humidity_2m, 0),
    isDay: raw.is_day === 1 || raw.is_day === true,
    precipitation: toFiniteNumber(raw.precipitation, 0),
    code: toFiniteNumber(raw.weather_code, -1),
    cloudCover: toFiniteNumber(raw.cloud_cover, 0),
    pressure: toFiniteNumber(raw.surface_pressure, 0),
    windSpeed: toFiniteNumber(raw.wind_speed_10m, 0),
    windDirection: toFiniteNumber(raw.wind_direction_10m, 0),
    windGusts: toFiniteNumber(raw.wind_gusts_10m, 0),
  };
}

function normalizeHourly(input: unknown): HourlyPoint[] {
  const raw = asRecord(input);
  if (!raw) return [];
  const times = asArray(raw.time);
  const temps = asArray(raw.temperature_2m);
  const probs = asArray(raw.precipitation_probability);
  const mms = asArray(raw.precipitation);
  const codes = asArray(raw.weather_code);
  const points: HourlyPoint[] = [];
  times.forEach((value, i) => {
    const time = asString(value);
    const temperature = toFiniteNumber(temps[i]);
    if (!time || temperature === null) return;
    points.push({
      time,
      temperature,
      precipProbability: toFiniteNumber(probs[i], 0),
      precipitation: toFiniteNumber(mms[i], 0),
      code: toFiniteNumber(codes[i], -1),
    });
  });
  return points;
}

function normalizeDaily(input: unknown): DailyPoint[] {
  const raw = asRecord(input);
  if (!raw) return [];
  const dates = asArray(raw.time);
  const maxes = asArray(raw.temperature_2m_max);
  const mins = asArray(raw.temperature_2m_min);
  const days: DailyPoint[] = [];
  dates.forEach((value, i) => {
    const date = asString(value);
    const max = toFiniteNumber(maxes[i]);
    const min = toFiniteNumber(mins[i]);
    if (!date || max === null || min === null) return;
    days.push({
      date,
      code: toFiniteNumber(asArray(raw.weather_code)[i], -1),
      max,
      min,
      precipSum: toFiniteNumber(asArray(raw.precipitation_sum)[i], 0),
      precipProbMax: toFiniteNumber(asArray(raw.precipitation_probability_max)[i], 0),
      sunrise: asString(asArray(raw.sunrise)[i]) ?? `${date}T06:00`,
      sunset: asString(asArray(raw.sunset)[i]) ?? `${date}T18:00`,
      uvMax: toFiniteNumber(asArray(raw.uv_index_max)[i], 0),
    });
  });
  return days;
}

/**
 * Convierte la respuesta cruda de Open-Meteo (arreglos paralelos) en objetos por hora y por dia.
 * Devuelve `null` si falta lo minimo para pintar la pantalla (ahora, horas y dias).
 */
export function normalizeForecast(input: unknown): Forecast | null {
  const raw = asRecord(input);
  if (!raw) return null;
  const current = normalizeCurrent(raw.current);
  const hourly = normalizeHourly(raw.hourly);
  const daily = normalizeDaily(raw.daily);
  if (!current || hourly.length === 0 || daily.length === 0) return null;
  return { current, hourly, daily };
}
