"use client";

import { useMemo, useState } from "react";
import { ActionButton } from "@/components/commons/ActionButton";
import { AgendaFilters, type RangeMode } from "@/components/commons/AgendaFilters";
import { EventDayGroup } from "@/components/commons/EventDayGroup";
import { EVENTS_WINDOW_DAYS } from "@/constants/events";
import { useNow } from "@/hooks/useNow";
import type { AgendaEvent, DayRange } from "@/types/event";
import { addDaysToKey } from "@/utils/addDaysToKey";
import { countActiveFilters } from "@/utils/countActiveFilters";
import { filterEvents, NO_EVENT_FILTERS } from "@/utils/filterEvents";
import { getQuickRange } from "@/utils/getQuickRange";
import { getResultsSummary } from "@/utils/getResultsSummary";
import { groupEventsByDay } from "@/utils/groupEventsByDay";
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

  // `useNow` vale 0 hasta que el navegador lo lee: asi el HTML del servidor y la primera pintura coinciden.
  const now = useNow(60_000) || Date.parse(generatedAt);
  const todayKey = toDayKey(now);

  const range = useMemo(
    () => (mode === "custom" ? customRange : getQuickRange(mode, todayKey)),
    [mode, customRange, todayKey],
  );

  const filtered = useMemo(() => filterEvents(events, filters), [events, filters]);
  const groups = useMemo(() => groupEventsByDay(filtered, range, now), [filtered, range, now]);

  const municipalities = useMemo(
    () => [...new Set(events.map((event) => event.municipality).filter((name): name is string => Boolean(name)))].sort((a, b) => a.localeCompare(b, "es")),
    [events],
  );
  const categories = useMemo(() => [...new Set(events.map((event) => event.category))], [events]);

  const total = groups.reduce((sum, group) => sum + group.occurrences.length, 0);
  const hasFilters = countActiveFilters(filters) > 0;

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
        maxDay={addDaysToKey(todayKey, EVENTS_WINDOW_DAYS)}
        filters={filters}
        municipalities={municipalities}
        categories={categories}
        onQuickChange={setMode}
        onFromChange={(from) => from && setDates({ from, to: range.to < from ? from : range.to })}
        onToChange={(to) => to && setDates({ from: range.from > to ? to : range.from, to })}
        onFiltersChange={setFilters}
      />

      <p className={styles.summary} aria-live="polite">
        {getResultsSummary(total, groups.length)}
      </p>

      {total === 0 ? (
        <div className={styles.empty}>
          <p>No hay eventos en estas fechas{hasFilters ? " con esos filtros" : ""}.</p>
          <div className={styles.emptyActions}>
            {mode !== "month" && <ActionButton onClick={() => setMode("month")}>Ver 30 días</ActionButton>}
            {hasFilters && <ActionButton onClick={() => setFilters(NO_EVENT_FILTERS)}>Quitar filtros</ActionButton>}
          </div>
        </div>
      ) : (
        groups.map((group) => <EventDayGroup key={group.dayKey} group={group} todayKey={todayKey} />)
      )}
    </div>
  );
}
