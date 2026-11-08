"use client";

import { useEffect, useState } from "react";

/**
 * Hora actual (ms) que se actualiza cada `intervalMs`. Vale 0 hasta que el navegador
 * la lee, asi el HTML del servidor y la primera pintura del cliente son iguales.
 */
export function useNow(intervalMs: number): number {
  const [now, setNow] = useState(0);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, intervalMs);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [intervalMs]);
  return now;
}
