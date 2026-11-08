"use client";

import { useLayoutEffect, useRef } from "react";
import { getTooltipLeft } from "@/utils/getTooltipLeft";
import styles from "./ChartTooltip.module.scss";

export type ChartTooltipRow = { key: "temp" | "rain"; value: string; label: string };

type ChartTooltipProps = {
  /** Posicion horizontal (px) del punto que se esta mirando. */
  x: number;
  hostWidth: number;
  title: string;
  rows: ChartTooltipRow[];
};

export function ChartTooltip({ x, hostWidth, title, rows }: ChartTooltipProps) {
  const ref = useRef<HTMLDivElement>(null);

  // El ancho real solo se conoce al pintar: se centra sobre el punto sin salirse del contenedor.
  useLayoutEffect(() => {
    const element = ref.current;
    if (element) element.style.left = `${getTooltipLeft(x, element.offsetWidth, hostWidth)}px`;
  });

  return (
    <div ref={ref} className={styles.tooltip}>
      <div className={styles.title}>{title}</div>
      {rows.map((row) => (
        <div key={`${row.key}-${row.label}`} className={styles.row}>
          <i className={`${styles.key} ${row.key === "temp" ? styles.temp : styles.rain}`} />
          <strong className={styles.value}>{row.value}</strong>
          <span className={styles.label}>{row.label}</span>
        </div>
      ))}
    </div>
  );
}
