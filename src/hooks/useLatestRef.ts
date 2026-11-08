import { useEffect, useRef } from "react";

/** Guarda siempre el ultimo valor para leerlo desde manejadores y temporizadores sin re-suscribirlos. */
export function useLatestRef<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref;
}
