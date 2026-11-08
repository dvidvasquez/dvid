import { CLIMA_PLACES, DEFAULT_PLACE } from "@/constants/climaPlaces";
import { fetchJson, type FetchJsonInit } from "@/lib/fetchJson";
import type { Forecast, Place, PlaceSnapshots } from "@/types/weather";
import { buildForecastUrl } from "@/utils/buildForecastUrl";
import { buildPlacesCurrentUrl } from "@/utils/buildPlacesCurrentUrl";
import { normalizeForecast } from "@/utils/normalizeForecast";
import { normalizePlaceSnapshots } from "@/utils/normalizePlaceSnapshots";

/** Datos que el servidor entrega a la pantalla para pintar sin esperar al navegador. */
export type ClimaInitialData = {
  placeId: string;
  forecast: Forecast | null;
  snapshots: PlaceSnapshots;
  /** Milisegundos desde epoch en que se pidieron los datos. */
  fetchedAt: number;
};

/** Pronostico completo de un lugar. Lanza si Open-Meteo falla o responde algo inesperado. */
export async function getForecast(place: Place, init?: FetchJsonInit): Promise<Forecast> {
  const forecast = normalizeForecast(await fetchJson(buildForecastUrl(place), init));
  if (!forecast) throw new Error("Respuesta de pronóstico inválida");
  return forecast;
}

/** Temperatura actual de todas las zonas (una sola consulta). */
export async function getPlaceSnapshots(
  places: readonly Place[] = CLIMA_PLACES,
  init?: FetchJsonInit,
): Promise<PlaceSnapshots> {
  return normalizePlaceSnapshots(await fetchJson(buildPlacesCurrentUrl(places), init), places);
}

/** Cada dato falla por separado: sin uno de ellos la pantalla igual carga y el navegador reintenta. */
export async function getInitialClima(revalidateSeconds: number): Promise<ClimaInitialData> {
  const init: FetchJsonInit = { next: { revalidate: revalidateSeconds } };
  const [forecast, snapshots] = await Promise.all([
    getForecast(DEFAULT_PLACE, init).catch(() => null),
    getPlaceSnapshots(CLIMA_PLACES, init).catch((): PlaceSnapshots => ({})),
  ]);
  return { placeId: DEFAULT_PLACE.id, forecast, snapshots, fetchedAt: Date.now() };
}
