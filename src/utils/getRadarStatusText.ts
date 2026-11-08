import type { RadarFrame } from "@/types/weather";
import { getRadarFrameLabel } from "./getRadarFrameLabel";

type RadarTextInput = {
  status: "loading" | "ready" | "error";
  /** `null` mientras no ha llegado ninguna respuesta. */
  frames: readonly RadarFrame[] | null;
  index: number;
  now: number;
};

/** Texto de la barra del radar: estado de carga, errores o la hora del cuadro mostrado. */
export function getRadarStatusText({ status, frames, index, now }: RadarTextInput): string {
  if (status === "error") return "No se pudo cargar el radar. Se reintenta en unos minutos.";
  if (!frames) return "Cargando imagen…";
  if (frames.length === 0) return "No hay imágenes disponibles en este momento.";
  const frame = frames[index];
  if (!frame || !now) return "Cargando imagen…";
  return getRadarFrameLabel(frame, now);
}
