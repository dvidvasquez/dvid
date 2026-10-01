import styles from "./Breakline.module.scss";

type BreaklineProps = {
  align?: "center" | "start";
};

export function Breakline({ align = "center" }: BreaklineProps) {
  return (
    <div className={`${styles.breakline} ${align === "start" ? styles.start : ""}`} role="separator">
      <span className={styles.spark} />
    </div>
  );
}
