import type { RadarFrame, RadarMaps } from "@/types/weather";
import { toFiniteNumber } from "./toFiniteNumber";

const DEFAULT_HOST = "https://tilecache.rainviewer.com";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function toFrames(list: unknown, forecast: boolean): RadarFrame[] {
  if (!Array.isArray(list)) return [];
  const frames: RadarFrame[] = [];
  for (const item of list) {
    const raw = asRecord(item);
    const time = toFiniteNumber(raw?.time);
    const path = raw?.path;
    if (time === null || typeof path !== "string" || !/^\/[\w\-./]+$/.test(path)) continue;
    frames.push({ time, path, forecast });
  }
  return frames;
}

function toHost(value: unknown): string {
  if (typeof value !== "string") return DEFAULT_HOST;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.origin : DEFAULT_HOST;
  } catch {
    return DEFAULT_HOST;
  }
}

/**
 * Respuesta de `weather-maps.json` de RainViewer: cuadros pasados y de pronostico (nowcast).
 * Las rutas son hashes y se usan tal cual vienen; la ruta se valida para no colar caracteres raros en la URL del mosaico.
 */
export function normalizeRadarMaps(input: unknown): RadarMaps | null {
  const raw = asRecord(input);
  if (!raw) return null;
  const radar = asRecord(raw.radar);
  return {
    host: toHost(raw.host),
    frames: [...toFrames(radar?.past, false), ...toFrames(radar?.nowcast, true)],
  };
}
