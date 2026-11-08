import { fetchJson, type FetchJsonInit } from "@/lib/fetchJson";
import type { RadarMaps } from "@/types/weather";
import { normalizeRadarMaps } from "@/utils/normalizeRadarMaps";

const RAINVIEWER_MAPS_URL = "https://api.rainviewer.com/public/weather-maps.json";

/** Cuadros disponibles del radar de RainViewer (pasados y de pronostico). */
export async function getRadarMaps(init?: FetchJsonInit): Promise<RadarMaps> {
  const maps = normalizeRadarMaps(await fetchJson(RAINVIEWER_MAPS_URL, { cache: "no-store", ...init }));
  if (!maps) throw new Error("Respuesta de radar inválida");
  return maps;
}
