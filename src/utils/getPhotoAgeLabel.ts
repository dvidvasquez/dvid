import { NBSP } from "@/constants/text";

/** Antiguedad de la foto de una camara a partir de su fecha ISO. */
export function getPhotoAgeLabel(updatedAt: string | null, now: number): string {
  const time = updatedAt ? Date.parse(updatedAt) : Number.NaN;
  if (Number.isNaN(time)) return "Hora de la foto no disponible";
  const minutes = Math.max(0, Math.round((now - time) / 60000));
  if (minutes < 2) return "Foto de hace un momento";
  if (minutes < 60) return `Foto de hace ${minutes}${NBSP}min`;
  const hours = Math.round(minutes / 60);
  return `Foto de hace ${hours}${NBSP}${hours === 1 ? "hora" : "horas"}`;
}
