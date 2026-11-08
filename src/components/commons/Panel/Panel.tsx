import type { ReactNode } from "react";
import styles from "./Panel.module.scss";

type PanelProps = {
  title?: string;
  /** Controles a la derecha del titulo. */
  actions?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function Panel({ title, actions, className, children }: PanelProps) {
  return (
    <div className={[styles.panel, className].filter(Boolean).join(" ")}>
      {title || actions ? (
        <div className={styles.head}>
          {title ? <h3 className={styles.title}>{title}</h3> : null}
          {actions}
        </div>
      ) : null}
      {children}
    </div>
  );
}
