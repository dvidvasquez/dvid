"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getWebcamList } from "@/services/webcamsClient.service";
import type { Webcam } from "@/types/webcam";
import { useLatestRef } from "./useLatestRef";

/** Las URLs de las fotos caducan a los 10 min en el plan gratis de Windy. */
const WEBCAM_TTL_MS = 4 * 60_000;
const CHECK_MS = 60_000;
const TOAST_MS = 6000;

type LoadResult = { ok: boolean; count: number };

/** Capa de camaras publicas: activar/desactivar, lista, camara elegida y avisos. */
export function useWebcams() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Webcam[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [imageFailed, setImageFailed] = useState(false);

  const enabledRef = useLatestRef(enabled);
  const listRef = useLatestRef(list);
  const loadedAtRef = useRef(0);
  const inflightRef = useRef<Promise<LoadResult> | null>(null);
  const retriedRef = useRef(false);

  const load = useCallback(
    (force: boolean): Promise<LoadResult> => {
      if (inflightRef.current) return inflightRef.current;
      const cached = listRef.current;
      if (!force && cached.length > 0 && Date.now() - loadedAtRef.current < WEBCAM_TTL_MS) {
        return Promise.resolve({ ok: true, count: cached.length });
      }
      const request: Promise<LoadResult> = getWebcamList()
        .then((next) => {
          loadedAtRef.current = Date.now();
          setList(next);
          setImageFailed(false);
          setSelectedId((current) => (current !== null && next.some((cam) => cam.id === current) ? current : null));
          return { ok: true, count: next.length };
        })
        .catch(() => ({ ok: false, count: listRef.current.length }))
        .finally(() => {
          inflightRef.current = null;
        });
      inflightRef.current = request;
      return request;
    },
    [listRef],
  );

  const toggle = useCallback(async () => {
    if (enabledRef.current) {
      setEnabled(false);
      setSelectedId(null);
      return;
    }
    setEnabled(true);
    setLoading(true);
    const result = await load(false);
    setLoading(false);
    if (!enabledRef.current) return; // se apago mientras cargaba
    if (!result.ok && result.count === 0) {
      setEnabled(false);
      setToast("Las cámaras no están disponibles ahora. Intenta de nuevo en un rato.");
    } else if (result.count === 0) {
      setToast("No encontré cámaras públicas cerca del Valle de Aburrá.");
    }
  }, [enabledRef, load]);

  const select = useCallback((id: number) => {
    retriedRef.current = false;
    setImageFailed(false);
    setToast(null);
    setSelectedId(id);
  }, []);

  const close = useCallback(() => setSelectedId(null), []);

  /** La foto no cargo: casi siempre caduco su enlace. Se piden enlaces nuevos una sola vez. */
  const onImageError = useCallback(() => {
    if (retriedRef.current) {
      setImageFailed(true);
      return;
    }
    retriedRef.current = true;
    void load(true).then((result) => {
      if (!result.ok) setImageFailed(true);
    });
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  // Mientras la capa esta activa, se renuevan las URLs antes de que caduquen.
  useEffect(() => {
    const timer = setInterval(() => {
      if (enabledRef.current && !document.hidden && Date.now() - loadedAtRef.current > WEBCAM_TTL_MS) {
        void load(true);
      }
    }, CHECK_MS);
    return () => clearInterval(timer);
  }, [enabledRef, load]);

  const selected = list.find((cam) => cam.id === selectedId) ?? null;

  return { enabled, loading, list, selected, toast, imageFailed, toggle, select, close, onImageError };
}
