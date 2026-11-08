import { fetchJson, type FetchJsonInit } from "@/lib/fetchJson";
import type { Webcam } from "@/types/webcam";
import { toWebcamList } from "@/utils/toWebcamList";

/** Camaras publicas desde nuestro propio `/api/webcams` (la key de Windy nunca llega al navegador). */
export async function getWebcamList(init?: FetchJsonInit): Promise<Webcam[]> {
  return toWebcamList(await fetchJson("/api/webcams", { cache: "no-store", timeoutMs: 12_000, ...init }));
}
