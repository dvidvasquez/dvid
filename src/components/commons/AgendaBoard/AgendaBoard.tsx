"use client";

import { useMemo, useState } from "react";
import { ActionButton } from "@/components/commons/ActionButton";
import { AgendaFilters, type RangeMode } from "@/components/commons/AgendaFilters";
import { EventDayGroup } from "@/components/commons/EventDayGroup";
import { SavedToggle } from "@/components/commons/SavedToggle";
import { EVENTS_WINDOW_DAYS } from "@/constants/events";
import { useNow } from "@/hooks/useNow";
import { useSavedEvents } from "@/hooks/useSavedEvents";
import type { AgendaEvent, DayRange } from "@/types/event";
import { addDaysToKey } from "@/utils/addDaysToKey";
import { countActiveFilters } from "@/utils/countActiveFilters";
import { filterEvents, NO_EVENT_FILTERS } from "@/utils/filterEvents";
import { getOccurrenceKey } from "@/utils/getOccurrenceKey";
import { getQuickRange } from "@/utils/getQuickRange";
import { getResultsSummary } from "@/utils/getResultsSummary";
import { groupEventsByDay } from "@/utils/groupEventsByDay";
import { isEventFinished } from "@/utils/isEventFinished";
import { mergeSavedEvents } from "@/utils/mergeSavedEvents";
import { toDayKey } from "@/utils/toDayKey";
import styles from "./AgendaBoard.module.scss";

type AgendaBoardProps = {
  events: AgendaEvent[];
  /** ISO 8601: cuando el servidor armo la lista. Sirve de "ahora" hasta que el navegador lee su reloj. */
  generatedAt: string;
};

export function AgendaBoard({ events, generatedAt }: AgendaBoardProps) {
  const [mode, setMode] = useState<RangeMode>("week");
  const [customRange, setCustomRange] = useState<DayRange>({ from: "", to: "" });
  const [filters, setFilters] = useState(NO_EVENT_FILTERS);
  /** Al ver solo los guardados se abre todo el rango; aqui queda el rango anterior para volver a el. */
  const [beforeSaved, setBeforeSaved] = useState<{ mode: RangeMode; customRange: DayRange } | null>(null);
  const savedOnly = beforeSaved !== null;
  const { saved, savedKeys, toggleSaved } = useSavedEvents();

  // `useNow` vale 0 hasta que el navegador lo lee: asi el HTML del servidor y la primera pintura coinciden.
  const now = useNow(60_000) || Date.parse(generatedAt);
  const todayKey = toDayKey(now);

  const range = useMemo(
    () => (mode === "custom" ? customRange : getQuickRange(mode, todayKey)),
    [mode, customRange, todayKey],
  );

  // Los guardados que las fuentes ya no traen siguen en la agenda hasta que pasan.
  const allEvents = useMemo(() => mergeSavedEvents(events, saved.map(({ event }) => event)), [events, saved]);
  const savedCount = useMemo(
    () => saved.filter(({ event, dayKey }) => dayKey >= todayKey && !isEventFinished(event, now)).length,
    [saved, todayKey, now],
  );

  const filtered = useMemo(() => filterEvents(allEvents, filters), [allEvents, filters]);
  const groups = useMemo(() => {
    const all = groupEventsByDay(filtered, range, now);
    if (!savedOnly) return all;
    // Un evento de varios dias solo sale en los dias en que se guardo.
    return all
      .map((group) => ({
        ...group,
        occurrences: group.occurrences.filter(({ event, dayKey }) => savedKeys.has(getOccurrenceKey(event, dayKey))),
      }))
      .filter((group) => group.occurrences.length > 0);
  }, [filtered, range, now, savedOnly, savedKeys]);

  const municipalities = useMemo(
    () => [...new Set(allEvents.map((event) => event.municipality).filter((name): name is string => Boolean(name)))].sort((a, b) => a.localeCompare(b, "es")),
    [allEvents],
  );
  const categories = useMemo(() => [...new Set(allEvents.map((event) => event.category))], [allEvents]);

  const total = groups.reduce((sum, group) => sum + group.occurrences.length, 0);
  const hasFilters = countActiveFilters(filters) > 0;

  const maxDay = addDaysToKey(todayKey, EVENTS_WINDOW_DAYS);

  const toggleSavedOnly = () => {
    if (beforeSaved) {
      setMode(beforeSaved.mode);
      setCustomRange(beforeSaved.customRange);
      setBeforeSaved(null);
      return;
    }
    setBeforeSaved({ mode, customRange });
    setMode("custom");
    setCustomRange({ from: todayKey, to: maxDay });
  };

  const setDates = (next: DayRange) => {
    setMode("custom");
    setCustomRange(next);
  };

  return (
    <div className={styles.board}>
      <AgendaFilters
        mode={mode}
        range={range}
        minDay={todayKey}
        maxDay={maxDay}
        filters={filters}
        municipalities={municipalities}
        categories={categories}
        onQuickChange={setMode}
        onFromChange={(from) => from && setDates({ from, to: range.to < from ? from : range.to })}
        onToChange={(to) => to && setDates({ from: range.from > to ? to : range.from, to })}
        onFiltersChange={setFilters}
      />

      <div className={styles.toolbar}>
        <p className={styles.summary} aria-live="polite">
          {getResultsSummary(total, groups.length)}
        </p>
        <SavedToggle count={savedCount} active={savedOnly} onToggle={toggleSavedOnly} />
      </div>

      {total === 0 ? (
        <div className={styles.empty}>
          {savedOnly && savedCount === 0 ? (
            <p>Aún no has guardado eventos. Toca el marcador de un evento para guardarlo.</p>
          ) : (
            <p>
              No hay eventos{savedOnly ? " guardados" : ""} en estas fechas{hasFilters ? " con esos filtros" : ""}.
            </p>
          )}
          <div className={styles.emptyActions}>
            {savedOnly && <ActionButton onClick={toggleSavedOnly}>Ver todos los eventos</ActionButton>}
            {!savedOnly && mode !== "month" && <ActionButton onClick={() => setMode("month")}>Ver 30 días</ActionButton>}
            {hasFilters && <ActionButton onClick={() => setFilters(NO_EVENT_FILTERS)}>Quitar filtros</ActionButton>}
          </div>
        </div>
      ) : (
        groups.map((group) => (
          <EventDayGroup key={group.dayKey} group={group} todayKey={todayKey} savedKeys={savedKeys} onToggleSaved={({ event, dayKey }) => toggleSaved(event, dayKey)} />
        ))
      )}
    </div>
  );
}
