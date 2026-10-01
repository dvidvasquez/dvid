import { Breakline } from "@/components/commons/Breakline";
import styles from "./SectionHeader.module.scss";

type SectionHeaderProps = {
  title: string;
};

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.rule}>
        <Breakline align="start" />
      </div>
    </header>
  );
}
