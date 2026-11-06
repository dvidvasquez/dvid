import type { Webcam } from "@/types/webcam";
import { normalizeWebcam } from "@/utils/normalizeWebcam";

const WINDY_WEBCAMS_URL = "https://api.windy.com/webcams/api/v3/webcams";
/** Centro del Valle de Aburra y radio en km (la API admite hasta 250). */
const CENTER = { lat: 6.27, lon: -75.57 };
const RADIUS_KM = 35;
const LIMIT = 50;
const REQUEST_TIMEOUT_MS = 8000;
/** Del mas completo al minimo: si la key no permite `player`/`urls` se reintenta con menos datos. */
const INCLUDE_VARIANTS = ["images,location,player,urls", "images,location"];

export type WebcamsResult =
  | { ok: true; webcams: Webcam[]; fetchedAt: string }
  | { ok: false; reason: "no-key" | "upstream"; status?: number };

function extractList(body: unknown): unknown[] {
  if (body !== null && typeof body === "object" && "webcams" in body) {
    const list = (body as { webcams: unknown }).webcams;
    if (Array.isArray(list)) return list;
  }
  return [];
}

/**
 * Camaras publicas de Windy cerca de Medellin. La key vive solo en el servidor
 * (`WINDY_API_KEY`). Las URLs de imagen que devuelve Windy caducan a los 10 minutos
 * en el plan gratis, por eso no se guarda nada en cache por mas de unos minutos.
 */
export async function getWebcams(): Promise<WebcamsResult> {
  const key = process.env.WINDY_API_KEY;
  if (!key) return { ok: false, reason: "no-key" };

  let lastStatus: number | undefined;
  for (const include of INCLUDE_VARIANTS) {
    const params = new URLSearchParams({
      nearby: `${CENTER.lat},${CENTER.lon},${RADIUS_KM}`,
      include,
      limit: String(LIMIT),
      lang: "es",
    });
    try {
      const res = await fetch(`${WINDY_WEBCAMS_URL}?${params}`, {
        headers: { "x-windy-api-key": key, Accept: "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (res.ok) {
        const webcams = extractList(await res.json())
          .map(normalizeWebcam)
          .filter((cam): cam is Webcam => cam !== null);
        return { ok: true, webcams, fetchedAt: new Date().toISOString() };
      }
      lastStatus = res.status;
      // Solo se reintenta con menos datos cuando la peticion fue rechazada por sus parametros.
      if (res.status !== 400 && res.status !== 403) break;
    } catch {
      break;
    }
  }
  return { ok: false, reason: "upstream", status: lastStatus };
}
