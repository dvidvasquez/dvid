import { ActionButton } from "../ActionButton";
import styles from "./StatusBanner.module.scss";

/** Aviso cuando no se pudo actualizar: se sigue mostrando el ultimo dato y se reintenta solo. */
export function StatusBanner({ onRetry }: { onRetry: () => void }) {
  return (
    <div className={styles.banner} role="status">
      <span>No se pudo actualizar. Se muestra el último dato y se reintenta solo.</span>
      <ActionButton onClick={onRetry}>Reintentar</ActionButton>
    </div>
  );
}
