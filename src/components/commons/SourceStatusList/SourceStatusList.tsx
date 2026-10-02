import type { NewsSourceStatus } from "@/services/news.service";
import styles from "./SourceStatusList.module.scss";

type SourceStatusListProps = {
  statuses: NewsSourceStatus[];
};

const STATUS_LABELS: Record<NewsSourceStatus["status"], string> = {
  ok: "Funciona",
  "sin-feed": "Sin RSS",
  error: "No responde",
};

export function SourceStatusList({ statuses }: SourceStatusListProps) {
  return (
    <ul className={styles.list}>
      {statuses.map(({ source, status, feedUrl, itemCount, message }) => (
        <li key={source.url} className={styles.row}>
          <div className={styles.info}>
            <a className={styles.name} href={source.url} target="_blank" rel="noopener noreferrer">
              {source.nombre}
            </a>
            <span className={styles.detail}>
              {feedUrl ?? (message ? `Error: ${message}` : "No se encontró un feed RSS o Atom")}
            </span>
          </div>
          <span className={`${styles.status} ${styles[status === "sin-feed" ? "missing" : status]}`}>
            {STATUS_LABELS[status]}
            {status === "ok" ? ` · ${itemCount}` : ""}
          </span>
        </li>
      ))}
    </ul>
  );
}
