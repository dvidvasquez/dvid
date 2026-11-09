import type { EventFilters } from "./filterEvents";

/** Cuantos filtros estan puestos (categorias, municipio, gratis y texto cuentan uno cada uno). */
export function countActiveFilters({ categories, municipality, freeOnly, query }: EventFilters): number {
  return [categories.length > 0, municipality !== "", freeOnly, query.trim() !== ""].filter(Boolean).length;
}
