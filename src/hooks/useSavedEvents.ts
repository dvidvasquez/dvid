"use client";

import { useCallback, useMemo } from "react";
import { SAVED_EVENTS_STORAGE_KEY } from "@/constants/events";
import type { AgendaEvent } from "@/types/event";
import { getEventKey } from "@/utils/getEventKey";
import { parseSavedEvents } from "@/utils/parseSavedEvents";
import { toggleSavedEvent } from "@/utils/toggleSavedEvent";
import { useStoredString } from "./useStoredString";

const EMPTY = "[]";

/**
 * Eventos guardados en este navegador (`localStorage`). Se guarda el evento completo, no solo su id,
 * para poder mostrarlo aunque la fuente deje de traerlo. `savedKeys` sirve para marcar las tarjetas.
 */
export function useSavedEvents(): {
  saved: AgendaEvent[];
  savedKeys: ReadonlySet<string>;
  toggleSaved: (event: AgendaEvent) => void;
} {
  const [stored, setStored] = useStoredString(SAVED_EVENTS_STORAGE_KEY, EMPTY);

  const saved = useMemo(() => parseSavedEvents(stored), [stored]);
  const savedKeys = useMemo(() => new Set(saved.map(getEventKey)), [saved]);
  const toggleSaved = useCallback(
    (event: AgendaEvent) => setStored(JSON.stringify(toggleSavedEvent(saved, event, Date.now()))),
    [saved, setStored],
  );

  return { saved, savedKeys, toggleSaved };
}
