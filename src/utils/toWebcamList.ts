import type { Webcam } from "@/types/webcam";
import { toFiniteNumber } from "./toFiniteNumber";
import { toSafeHttpsUrl } from "./toSafeHttpsUrl";

/**
 * Lista de camaras que responde `/api/webcams`. El servidor ya la normalizo; aqui solo se
 * descarta lo malformado y se vuelve a exigir https en cada enlace antes de usarlo en `src`/`href`.
 */
export function toWebcamList(input: unknown): Webcam[] {
  const list = input !== null && typeof input === "object" ? (input as { webcams?: unknown }).webcams : null;
  if (!Array.isArray(list)) return [];
  const cams: Webcam[] = [];
  for (const item of list) {
    if (item === null || typeof item !== "object") continue;
    const raw = item as Record<string, unknown>;
    const id = toFiniteNumber(raw.id);
    const lat = toFiniteNumber(raw.lat);
    const lon = toFiniteNumber(raw.lon);
    if (id === null || lat === null || lon === null) continue;
    cams.push({
      id,
      lat,
      lon,
      title: typeof raw.title === "string" && raw.title.trim() ? raw.title.trim() : "Cámara",
      thumbnail: toSafeHttpsUrl(raw.thumbnail),
      preview: toSafeHttpsUrl(raw.preview),
      pageUrl: toSafeHttpsUrl(raw.pageUrl),
      liveUrl: toSafeHttpsUrl(raw.liveUrl),
      dayUrl: toSafeHttpsUrl(raw.dayUrl),
      updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : null,
    });
  }
  return cams;
}
