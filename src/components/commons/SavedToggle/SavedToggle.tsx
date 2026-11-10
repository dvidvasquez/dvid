import styles from "./SavedToggle.module.scss";

type SavedToggleProps = {
  /** Cuantos eventos hay guardados. */
  count: number;
  active: boolean;
  onToggle: () => void;
};

/** Interruptor para ver solo los eventos guardados, con la cantidad. */
export function SavedToggle({ count, active, onToggle }: SavedToggleProps) {
  return (
    <button type="button" className={styles.toggle} aria-pressed={active} onClick={onToggle}>
      <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1z" />
      </svg>
      Guardados
      <span className={styles.count}>{count}</span>
    </button>
  );
}
