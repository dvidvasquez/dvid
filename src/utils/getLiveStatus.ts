export type LiveStatus = "live" | "stale" | "error";

const STALE_AFTER_MS = 12 * 60_000;

/** Punto de estado de la tarjeta: verde al dia, ambar si hace mas de 12 min que no actualiza, rojo si fallo. */
export function getLiveStatus(input: { error: boolean; fetchedAt: number; now: number }): LiveStatus {
  if (input.error) return "error";
  if (input.fetchedAt && input.now && input.now - input.fetchedAt > STALE_AFTER_MS) return "stale";
  return "live";
}
