import { UNKNOWN_WEATHER, WEATHER_CODES, type WeatherCodeInfo } from "@/constants/weatherCodes";

export function describeWeather(code: number): WeatherCodeInfo {
  return WEATHER_CODES[code] ?? UNKNOWN_WEATHER;
}
