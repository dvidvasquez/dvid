/**
 * Barra con las dos esquinas de arriba redondeadas (hasta 4 px).
 * Una barra nunca mide menos de 2 px para que los valores pequenos se vean.
 */
export function buildBarPath(centerX: number, width: number, baseY: number, topY: number): string {
  let top = topY;
  let height = baseY - top;
  if (height < 2) {
    top = baseY - 2;
    height = 2;
  }
  const radius = Math.min(4, width / 2, height);
  const left = centerX - width / 2;
  const right = left + width;
  return `M${left} ${baseY}V${top + radius}Q${left} ${top} ${left + radius} ${top}H${right - radius}Q${right} ${top} ${right} ${top + radius}V${baseY}Z`;
}
