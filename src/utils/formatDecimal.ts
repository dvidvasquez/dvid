/** Un decimal como maximo y coma decimal (`0,5`, `12`). Sin `Intl` para que servidor y navegador coincidan. */
export function formatDecimal(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return String(rounded).replace(".", ",");
}
