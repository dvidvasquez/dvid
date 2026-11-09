import { EVENT_DEFAULT_COVER } from "@/constants/events";
import { toSafeHttpsUrl } from "./toSafeHttpsUrl";

/** Imagen del evento si es una URL https; si no, la portada por defecto. */
export function getEventCover(image: string | null | undefined): string {
  return toSafeHttpsUrl(image?.trim()) ?? EVENT_DEFAULT_COVER;
}
