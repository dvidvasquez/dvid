import type { AgendaEvent } from "@/types/event";
import { getEventKey } from "./getEventKey";

/**
 * Identidad de un evento en un dia concreto (`YYYY-MM-DD`): un evento de varios dias aparece una vez
 * por dia y cada aparicion se guarda por separado.
 */
export function getOccurrenceKey(event: Pick<AgendaEvent, "title" | "start">, dayKey: string): string {
  return `${getEventKey(event)}|${dayKey}`;
}
