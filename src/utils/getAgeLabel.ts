import { NBSP } from "@/constants/text";

/** `hace menos de 1 min` / `hace 7 min`. Vacio si todavia no hay dato. */
export function getAgeLabel(fetchedAt: number, now: number): string {
  if (!fetchedAt) return "";
  const minutes = Math.floor((now - fetchedAt) / 60000);
  return minutes < 1 ? `hace menos de 1${NBSP}min` : `hace ${minutes}${NBSP}min`;
}
