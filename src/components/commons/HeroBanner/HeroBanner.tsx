import styles from "./HeroBanner.module.scss";

type HeroBannerProps = {
  title: string;
};

export function HeroBanner({ title }: HeroBannerProps) {
  return (
    <section className={styles.banner}>
      <h1 className={styles.srOnly}>{title}</h1>
      <div className={styles.scene} aria-hidden="true">
        <span className={styles.grid} />
        <span className={styles.haze} />
        <span className={styles.halo} />
        <span className={styles.core} />
        <svg className={styles.rings} viewBox="0 0 200 200">
          <circle className={styles.ringOuter} cx="100" cy="100" r="92" />
          <circle className={styles.ringMiddle} cx="100" cy="100" r="72" />
          <circle className={styles.ringInner} cx="100" cy="100" r="54" />
          <g className={styles.orbit}>
            <circle className={styles.satellite} cx="100" cy="8" r="3" />
          </g>
          <g className={styles.orbitReverse}>
            <circle className={styles.moon} cx="100" cy="172" r="1.75" />
          </g>
        </svg>
        <span className={styles.sweep} />
      </div>
    </section>
  );
}
