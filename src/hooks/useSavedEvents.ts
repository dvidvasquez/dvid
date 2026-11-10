"use client";

import { useCallback, useMemo } from "react";
import { SAVED_EVENTS_STORAGE_KEY } from "@/constants/events";
import type { AgendaEvent, SavedEvent } from "@/types/event";
import { getOccurrenceKey } from "@/utils/getOccurrenceKey";
import { parseSavedEvents } from "@/utils/parseSavedEvents";
import { toggleSavedEvent } from "@/utils/toggleSavedEvent";
import { useStoredString } from "./useStoredString";

const EMPTY = "[]";

/**
 * Eventos guardados en este navegador (`localStorage`), cada uno en un dia concreto. Se guarda el
 * evento completo, no solo su id, para poder mostrarlo aunque la fuente deje de traerlo.
 * `savedKeys` (claves de `getOccurrenceKey`) sirve para marcar las tarjetas.
 */
export function useSavedEvents(): {
  saved: SavedEvent[];
  savedKeys: ReadonlySet<string>;
  toggleSaved: (event: AgendaEvent, dayKey: string) => void;
} {
  const [stored, setStored] = useStoredString(SAVED_EVENTS_STORAGE_KEY, EMPTY);

  const saved = useMemo(() => parseSavedEvents(stored), [stored]);
  const savedKeys = useMemo(() => new Set(saved.map(({ event, dayKey }) => getOccurrenceKey(event, dayKey))), [saved]);
  const toggleSaved = useCallback(
    (event: AgendaEvent, dayKey: string) => setStored(JSON.stringify(toggleSavedEvent(saved, event, dayKey, Date.now()))),
    [saved, setStored],
  );

  return { saved, savedKeys, toggleSaved };
}
