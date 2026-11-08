import type { Place } from "@/types/weather";

export function findPlaceById(places: readonly Place[], id: string | null | undefined): Place | null {
  return places.find((place) => place.id === id) ?? null;
}
