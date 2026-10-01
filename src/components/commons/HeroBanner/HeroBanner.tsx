import { Breakline } from "@/components/commons/Breakline";
import { ParticleField } from "@/components/commons/ParticleField";
import styles from "./HeroBanner.module.scss";

type HeroBannerProps = {
  title: string;
};

export function HeroBanner({ title }: HeroBannerProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.field}>
        <ParticleField />
      </div>
      <div className={styles.signature}>
        <h1 className={styles.name}>{title}</h1>
        <span className={styles.scrollCue} aria-hidden="true" />
      </div>
      <div className={styles.rule}>
        <Breakline />
      </div>
    </section>
  );
}
