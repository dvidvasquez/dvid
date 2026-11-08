/** Centro del tooltip: sigue al cursor pero sin salirse del contenedor. */
export function getTooltipLeft(x: number, tooltipWidth: number, hostWidth: number): number {
  const half = tooltipWidth / 2;
  return Math.max(half + 4, Math.min(hostWidth - half - 4, x));
}
