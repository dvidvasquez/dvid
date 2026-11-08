import type { Webcam } from "@/types/webcam";
import { toSafeHttpsUrl } from "./toSafeHttpsUrl";

/** Foto a mostrar: la vista previa si existe y, si no, la miniatura. `null` si ninguna es https. */
export function getWebcamPhotoUrl(cam: Pick<Webcam, "preview" | "thumbnail">): string | null {
  return toSafeHttpsUrl(cam.preview) ?? toSafeHttpsUrl(cam.thumbnail);
}
