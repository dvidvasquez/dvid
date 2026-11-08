export function getHumidityLabel(percent: number): string {
  if (percent < 40) return "Aire seco";
  if (percent < 70) return "Cómodo";
  if (percent < 85) return "Húmedo";
  return "Muy húmedo";
}
