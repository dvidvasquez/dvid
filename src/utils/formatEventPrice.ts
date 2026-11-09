/** `0` -> `Gratis`; `25000` -> `Desde $25.000`; `null` (no se sabe) -> `null`. */
export function formatEventPrice(price: number | null): string | null {
  if (price === null) return null;
  if (price === 0) return "Gratis";
  return `Desde $${String(Math.round(price)).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}
