import { EVENT_SOURCE_VIA_LABELS } from "@/constants/eventSources";
import type { EventSourceStatus } from "@/services/events.service";
import styles from "./EventSourcesPanel.module.scss";

type EventSourcesPanelProps = {
  statuses: EventSourceStatus[];
};

const STATUS_LABELS: Record<EventSourceStatus["status"], string> = {
  ok: "Funciona",
  "sin-eventos": "Sin eventos",
  error: "No responde",
};

function getDetail({ status, via, eventCount, withImageCount, message }: EventSourceStatus): string {
  if (status !== "ok") return message ?? "Respondió, pero no hay eventos en el rango.";
  const base = `${eventCount} ${eventCount === 1 ? "evento" : "eventos"}, ${withImageCount} con imagen · ${via ? EVENT_SOURCE_VIA_LABELS[via] : ""}`;
  return message ? `${base} · ${message}` : base;
}

/** Que fuentes respondieron y por que no, para saber de donde sale (o falta) cada evento. */
export function EventSourcesPanel({ statuses }: EventSourcesPanelProps) {
  const working = statuses.filter(({ status }) => status === "ok").length;

  return (
    <details className={styles.panel}>
      <summary className={styles.summary}>
        Fuentes: {working} de {statuses.length} con eventos
      </summary>
      <ul className={styles.list}>
        {statuses.map((entry) => (
          <li key={entry.source.nombre} className={styles.row}>
            <div className={styles.info}>
              <a className={styles.name} href={entry.source.url} target="_blank" rel="noopener noreferrer">
                {entry.source.nombre}
              </a>
              <span className={styles.detail}>{getDetail(entry)}</span>
            </div>
            <span className={`${styles.status} ${styles[entry.status === "sin-eventos" ? "empty" : entry.status]}`}>
              {STATUS_LABELS[entry.status]}
            </span>
          </li>
        ))}
      </ul>
    </details>
  );
}
