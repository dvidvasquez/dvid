import type { Place } from "@/types/weather";

/** Lugar de la lista mas cercano a un punto (distancia plana: sobra para unos pocos km). */
export function findNearestPlace(lat: number, lon: number, places: readonly Place[]): Place | null {
  let best: Place | null = null;
  let bestDistance = Infinity;
  for (const place of places) {
    const dx = place.lat - lat;
    const dy = place.lon - lon;
    const distance = dx * dx + dy * dy;
    if (distance < bestDistance) {
      bestDistance = distance;
      best = place;
    }
  }
  return best;
}
