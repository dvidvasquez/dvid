/** Cada cuantas horas se escribe una etiqueta: 3, o 6 si no cabe. */
export function getXAxisStride(plotWidth: number, count: number): number {
  if (count < 2) return 3;
  return (plotWidth / (count - 1)) * 3 < 64 ? 6 : 3;
}
