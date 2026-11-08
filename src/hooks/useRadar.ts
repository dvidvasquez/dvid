"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getRadarMaps } from "@/services/radar.service";
import type { RadarMaps } from "@/types/weather";
import { getLatestPastIndex } from "@/utils/getLatestPastIndex";

const RADAR_TTL_MS = 9 * 60_000;
const CHECK_MS = 60_000;
const FRAME_MS = 650;
const LAST_FRAME_MS = 1500;

export type RadarStatus = "loading" | "ready" | "error";

/** Cuadros del radar, cuadro mostrado y reproduccion. Se vuelve a pedir cuando tienen mas de 9 minutos. */
export function useRadar() {
  const [maps, setMaps] = useState<RadarMaps | null>(null);
  const [status, setStatus] = useState<RadarStatus>("loading");
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const loadedAtRef = useRef(0);

  const load = useCallback(async () => {
    try {
      const next = await getRadarMaps();
      loadedAtRef.current = Date.now();
      setMaps(next);
      setIndex(getLatestPastIndex(next.frames));
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    const first = setTimeout(() => {
      void load();
    }, 0);
    const check = setInterval(() => {
      if (!document.hidden && Date.now() - loadedAtRef.current > RADAR_TTL_MS) void load();
    }, CHECK_MS);
    return () => {
      clearTimeout(first);
      clearInterval(check);
    };
  }, [load]);

  const frameCount = maps?.frames.length ?? 0;
  const isPlaying = playing && frameCount > 1;

  useEffect(() => {
    if (!isPlaying) return;
    const delay = index === frameCount - 1 ? LAST_FRAME_MS : FRAME_MS;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % frameCount), delay);
    return () => clearTimeout(timer);
  }, [isPlaying, index, frameCount]);

  const togglePlay = useCallback(() => setPlaying((p) => !p), []);
  const seek = useCallback((next: number) => {
    setPlaying(false);
    setIndex(next);
  }, []);
  const reload = useCallback(() => {
    void load();
  }, [load]);

  return { maps, status, index, playing: isPlaying, togglePlay, seek, reload };
}
