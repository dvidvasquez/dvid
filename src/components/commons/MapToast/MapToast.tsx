import styles from "./MapToast.module.scss";

export function MapToast({ message }: { message: string }) {
  return (
    <p className={styles.toast} role="status">
      {message}
    </p>
  );
}
