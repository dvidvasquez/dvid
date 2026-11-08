"use client";

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
/** Respaldo cuando `localStorage` esta bloqueado (modo privado, politicas del navegador). */
const memory = new Map<string, string>();

function readItem(key: string): string | null {
  try {
    const stored = window.localStorage.getItem(key);
    if (stored !== null) return stored;
  } catch {
    /* sin almacenamiento */
  }
  return memory.get(key) ?? null;
}

function writeItem(key: string, value: string) {
  memory.set(key, value);
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* sin almacenamiento */
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/**
 * Texto guardado en el navegador. En el servidor (y al hidratar) vale `fallback`;
 * despues pasa al valor guardado sin desajustes de hidratacion.
 */
export function useStoredString(key: string, fallback: string): [string, (value: string) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => readItem(key) ?? fallback,
    () => fallback,
  );
  const setValue = useCallback((next: string) => writeItem(key, next), [key]);
  return [value, setValue];
}
