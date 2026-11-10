import type { AgendaEvent } from "@/types/event";
import { foldText } from "./foldText";
import { toDayKey } from "./toDayKey";

/**
 * Identidad de un evento sin importar la fuente: titulo (sin tildes, signos ni mayusculas) y dia de
 * inicio. Sirve para juntar repetidos y para reconocer un evento guardado aunque cambie de fuente.
 */
export function getEventKey(event: Pick<AgendaEvent, "title" | "start">): string {
  const title = foldText(event.title).replace(/[^a-z0-9]+/g, " ").trim();
  return `${title}|${toDayKey(event.start)}`;
}
