import type { Webcam } from "@/types/webcam";

type Raw = Record<string, unknown>;

function asRecord(value: unknown): Raw | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Raw)
    : null;
}

function asNumber(value: unknown): number | null {
  const n = typeof value === "string" && value.trim() !== "" ? Number(value) : value;
  return typeof n === "number" && Number.isFinite(n) ? n : null;
}

/** Solo acepta URLs https para no inyectar esquemas raros en `src`/`href`. */
function asHttpsUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function asIsoDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const time = Date.parse(value);
  return Number.isNaN(time) ? null : new Date(time).toISOString();
}

/**
 * Convierte una camara cruda de la API v3 de Windy en un `Webcam` seguro para la UI.
 * Devuelve `null` si falta lo minimo (id, coordenadas, alguna imagen) o si no esta activa.
 */
export function normalizeWebcam(input: unknown): Webcam | null {
  const raw = asRecord(input);
  if (!raw) return null;

  const id = asNumber(raw.webcamId);
  if (id === null) return null;
  if (typeof raw.status === "string" && raw.status !== "active") return null;

  const location = asRecord(raw.location);
  const lat = asNumber(location?.latitude);
  const lon = asNumber(location?.longitude);
  if (lat === null || lon === null || Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;

  const current = asRecord(asRecord(raw.images)?.current);
  const thumbnail = asHttpsUrl(current?.thumbnail) ?? asHttpsUrl(current?.icon);
  const preview = asHttpsUrl(current?.preview) ?? thumbnail;
  if (!thumbnail && !preview) return null;

  const player = asRecord(raw.player);
  const urls = asRecord(raw.urls);
  const title = typeof raw.title === "string" ? raw.title.trim() : "";

  return {
    id,
    title: title || "Cámara sin nombre",
    lat,
    lon,
    thumbnail: thumbnail ?? preview,
    preview,
    // Windy exige enlazar cada imagen a su pagina; si la API no la trae, se usa su URL publica.
    pageUrl: asHttpsUrl(urls?.detail) ?? `https://www.windy.com/webcams/${id}`,
    liveUrl: asHttpsUrl(player?.live),
    dayUrl: asHttpsUrl(player?.day),
    updatedAt: asIsoDate(raw.lastUpdatedOn),
  };
}
