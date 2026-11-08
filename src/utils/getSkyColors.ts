import type { WeatherKind } from "@/types/weather";

type SkyKey = "clear" | "partly" | "overcast" | "rain" | "storm" | "fog";

const SKY_BY_KIND: Record<WeatherKind, SkyKey> = {
  clear: "clear",
  partly: "partly",
  cloudy: "overcast",
  drizzle: "rain",
  rain: "rain",
  storm: "storm",
  fog: "fog",
  snow: "overcast",
};

const DAY: Record<SkyKey, [string, string]> = {
  clear: ["#0a3a6b", "#2a74b5"],
  partly: ["#1f4468", "#4a7396"],
  overcast: ["#36424d", "#5a6874"],
  rain: ["#1b2f3d", "#3b5a6b"],
  storm: ["#201d2c", "#473d5a"],
  fog: ["#46515a", "#66717a"],
};

const NIGHT: Record<SkyKey, [string, string]> = {
  clear: ["#08122b", "#1b2e55"],
  partly: ["#0f1a2e", "#2c3c58"],
  overcast: ["#141b27", "#2e3b4d"],
  rain: ["#0e1a24", "#26404f"],
  storm: ["#14121d", "#322a44"],
  fog: ["#222a31", "#3d4850"],
};

/** Par de colores (arriba, abajo) del degradado del cielo segun el tiempo y si es de dia. */
export function getSkyColors(kind: WeatherKind, isDay: boolean): [string, string] {
  const key = SKY_BY_KIND[kind] ?? "overcast";
  return (isDay ? DAY : NIGHT)[key];
}
