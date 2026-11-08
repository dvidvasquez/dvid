/** Devuelve el numero si es finito; si no, `fallback` (por defecto `null`). */
export function toFiniteNumber(value: unknown): number | null;
export function toFiniteNumber(value: unknown, fallback: number): number;
export function toFiniteNumber(value: unknown, fallback: number | null = null): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
