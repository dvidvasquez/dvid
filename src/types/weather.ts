/** Categoria visual del tiempo: decide icono y color del cielo. */
export type WeatherKind = "clear" | "partly" | "cloudy" | "fog" | "drizzle" | "rain" | "snow" | "storm";

export type Place = {
  id: string;
  name: string;
  lat: number;
  lon: number;
};

/** Condiciones actuales de un lugar (Open-Meteo, hora local de Bogota). */
export type CurrentConditions = {
  /** `YYYY-MM-DDTHH:mm` en hora local. */
  time: string;
  temperature: number;
  apparent: number;
  humidity: number;
  isDay: boolean;
  /** Milimetros en el ultimo intervalo. */
  precipitation: number;
  code: number;
  cloudCover: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
};

export type HourlyPoint = {
  /** `YYYY-MM-DDTHH:00` en hora local. */
  time: string;
  temperature: number;
  /** Probabilidad de lluvia, 0-100. */
  precipProbability: number;
  precipitation: number;
  code: number;
};

export type DailyPoint = {
  /** `YYYY-MM-DD`. */
  date: string;
  code: number;
  max: number;
  min: number;
  precipSum: number;
  precipProbMax: number;
  sunrise: string;
  sunset: string;
  uvMax: number;
};

export type Forecast = {
  current: CurrentConditions;
  hourly: HourlyPoint[];
  daily: DailyPoint[];
};

/** Resumen de un lugar para su burbuja en el mapa. */
export type PlaceSnapshot = {
  temperature: number;
  wet: boolean;
  code: number;
};

export type PlaceSnapshots = Record<string, PlaceSnapshot>;

/** Las proximas 24 horas (hasta 25 puntos) a partir de la hora actual. */
export type HourlySeries = {
  /** Posicion de la hora actual dentro de `Forecast.hourly`. */
  startIndex: number;
  points: HourlyPoint[];
};

export type RainMode = "prob" | "mm";

export type RadarFrame = {
  /** Segundos desde epoch. */
  time: number;
  /** Ruta hash que entrega la API (nunca se arma a mano). */
  path: string;
  /** `true` si es pronostico y no una imagen real. */
  forecast: boolean;
};

export type RadarMaps = {
  host: string;
  frames: RadarFrame[];
};

export type ChartScale = {
  min: number;
  max: number;
  step: number;
};
