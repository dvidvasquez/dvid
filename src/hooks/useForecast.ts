"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CLIMA_PLACES } from "@/constants/climaPlaces";
import { getForecast, getPlaceSnapshots, type ClimaInitialData } from "@/services/weather.service";
import type { Forecast, Place, PlaceSnapshots } from "@/types/weather";

const REFRESH_MS = 5 * 60_000;
const RETRY_MS = 60_000;

type ForecastState = {
  forecast: Forecast | null;
  /** Lugar al que pertenece `forecast` (puede ir un paso atras mientras llega el nuevo). */
  forecastPlaceId: string | null;
  snapshots: PlaceSnapshots;
  fetchedAt: number;
  error: boolean;
  refreshing: boolean;
};

/**
 * Pronostico del lugar elegido y temperaturas de todas las zonas. Se actualiza solo cada
 * 5 minutos (si la pestana esta visible), al volver a la pestana y al cambiar de lugar.
 * Si falla conserva el ultimo dato y reintenta al minuto.
 */
export function useForecast(place: Place, initial: ClimaInitialData | null) {
  const [state, setState] = useState<ForecastState>(() => ({
    forecast: initial?.forecast ?? null,
    forecastPlaceId: initial?.forecast ? initial.placeId : null,
    snapshots: initial?.snapshots ?? {},
    fetchedAt: initial?.forecast ? initial.fetchedAt : 0,
    error: false,
    refreshing: false,
  }));
  const tokenRef = useRef(0);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchedAtRef = useRef(initial?.forecast ? initial.fetchedAt : 0);
  const loadRef = useRef<() => Promise<void>>(async () => {});

  const load = useCallback(async () => {
    const token = ++tokenRef.current;
    if (retryRef.current) clearTimeout(retryRef.current);
    setState((s) => ({ ...s, refreshing: true }));
    try {
      const [forecast, snapshots] = await Promise.all([
        getForecast(place, { cache: "no-store" }),
        getPlaceSnapshots(CLIMA_PLACES, { cache: "no-store" }).catch(() => null),
      ]);
      if (token !== tokenRef.current) return; // llego tarde: ya hay una peticion mas nueva
      const fetchedAt = Date.now();
      fetchedAtRef.current = fetchedAt;
      setState((s) => ({
        forecast,
        forecastPlaceId: place.id,
        snapshots: snapshots ?? s.snapshots,
        fetchedAt,
        error: false,
        refreshing: false,
      }));
    } catch {
      if (token !== tokenRef.current) return;
      setState((s) => ({ ...s, error: true, refreshing: false }));
      retryRef.current = setTimeout(() => {
        void loadRef.current();
      }, RETRY_MS);
    }
  }, [place]);

  useEffect(() => {
    loadRef.current = load;
  }, [load]);

  // Al abrir y cada vez que cambia el lugar.
  useEffect(() => {
    const timer = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(timer);
  }, [load]);

  // Actualizacion periodica y al volver a la pestana.
  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden) void loadRef.current();
    }, REFRESH_MS);
    const onVisible = () => {
      if (!document.hidden && Date.now() - fetchedAtRef.current > REFRESH_MS) void loadRef.current();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
      tokenRef.current += 1;
      if (retryRef.current) clearTimeout(retryRef.current);
    };
  }, []);

  const refresh = useCallback(() => {
    void load();
  }, [load]);

  return { ...state, refresh };
}
