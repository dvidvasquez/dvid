import type { WeatherKind } from "@/types/weather";

export type WeatherCodeInfo = { label: string; kind: WeatherKind };

/** Codigos de tiempo WMO que usa Open-Meteo. */
export const WEATHER_CODES: Readonly<Record<number, WeatherCodeInfo>> = {
  0: { label: "Despejado", kind: "clear" },
  1: { label: "Mayormente despejado", kind: "clear" },
  2: { label: "Parcialmente nublado", kind: "partly" },
  3: { label: "Nublado", kind: "cloudy" },
  45: { label: "Niebla", kind: "fog" },
  48: { label: "Niebla con escarcha", kind: "fog" },
  51: { label: "Llovizna ligera", kind: "drizzle" },
  53: { label: "Llovizna", kind: "drizzle" },
  55: { label: "Llovizna intensa", kind: "drizzle" },
  56: { label: "Llovizna helada", kind: "drizzle" },
  57: { label: "Llovizna helada intensa", kind: "drizzle" },
  61: { label: "Lluvia ligera", kind: "rain" },
  63: { label: "Lluvia moderada", kind: "rain" },
  65: { label: "Lluvia fuerte", kind: "rain" },
  66: { label: "Lluvia helada", kind: "rain" },
  67: { label: "Lluvia helada fuerte", kind: "rain" },
  71: { label: "Nevada ligera", kind: "snow" },
  73: { label: "Nevada", kind: "snow" },
  75: { label: "Nevada fuerte", kind: "snow" },
  77: { label: "Granizo fino", kind: "snow" },
  80: { label: "Chubascos ligeros", kind: "rain" },
  81: { label: "Chubascos", kind: "rain" },
  82: { label: "Chubascos fuertes", kind: "rain" },
  85: { label: "Chubascos de nieve", kind: "snow" },
  86: { label: "Chubascos de nieve fuertes", kind: "snow" },
  95: { label: "Tormenta eléctrica", kind: "storm" },
  96: { label: "Tormenta con granizo", kind: "storm" },
  99: { label: "Tormenta fuerte con granizo", kind: "storm" },
};

export const UNKNOWN_WEATHER: WeatherCodeInfo = { label: "Sin dato", kind: "cloudy" };
