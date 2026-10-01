import { Breakline } from "@/components/commons/Breakline";
import styles from "./SectionHeader.module.scss";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
};

export function SectionHeader({ title, subtitle, eyebrow }: SectionHeaderProps) {
  return (
    <header className={styles.header}>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <h1 className={styles.title}>{title}</h1>
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      <div className={styles.rule}>
        <Breakline align="start" />
      </div>
    </header>
  );
}
