export function getUvLabel(uv: number): string {
  if (uv < 3) return "Bajo";
  if (uv < 6) return "Moderado";
  if (uv < 8) return "Alto";
  if (uv < 11) return "Muy alto";
  return "Extremo";
}
