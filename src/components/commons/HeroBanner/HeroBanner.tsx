import { Breakline } from "@/components/commons/Breakline";
import { ParticleField } from "@/components/commons/ParticleField";
import styles from "./HeroBanner.module.scss";

type HeroBannerProps = {
  title: string;
};

export function HeroBanner({ title }: HeroBannerProps) {
  return (
    <section className={styles.banner}>
      <h1 className={styles.srOnly}>{title}</h1>
      <div className={styles.field}>
        <ParticleField />
      </div>
      <Breakline />
    </section>
  );
}
