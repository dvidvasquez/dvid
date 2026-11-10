import { EventCard } from "@/components/commons/EventCard";
import type { AgendaEvent, EventDayGroup as EventDayGroupData } from "@/types/event";
import { getEventKey } from "@/utils/getEventKey";
import { formatDayHeading } from "@/utils/formatDayHeading";
import styles from "./EventDayGroup.module.scss";

type EventDayGroupProps = {
  group: EventDayGroupData;
  todayKey: string;
  /** Claves (`getEventKey`) de los eventos guardados. */
  savedKeys: ReadonlySet<string>;
  onToggleSaved: (event: AgendaEvent) => void;
};

/** Un dia de la agenda: titulo fijo con la fecha y la cantidad, y sus eventos. */
export function EventDayGroup({ group, todayKey, savedKeys, onToggleSaved }: EventDayGroupProps) {
  const isToday = group.dayKey === todayKey;

  return (
    <section className={styles.group} aria-labelledby={`day-${group.dayKey}`}>
      <h2 id={`day-${group.dayKey}`} className={styles.heading}>
        <span className={isToday ? styles.today : undefined}>{formatDayHeading(group.dayKey, todayKey)}</span>
        <span className={styles.count}>{group.occurrences.length}</span>
      </h2>
      <ul className={styles.list}>
        {group.occurrences.map((occurrence) => (
          <li key={`${occurrence.event.id}-${occurrence.dayKey}`}>
            <EventCard occurrence={occurrence} saved={savedKeys.has(getEventKey(occurrence.event))} onToggleSaved={onToggleSaved} />
          </li>
        ))}
      </ul>
    </section>
  );
}
