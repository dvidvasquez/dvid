export function getCloudLabel(percent: number): string {
  if (percent < 20) return "Cielo despejado";
  if (percent < 60) return "Algo nublado";
  if (percent < 90) return "Muy nublado";
  return "Cubierto";
}
