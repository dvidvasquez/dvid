"use client";

import { useId, useState } from "react";
import type { HourlyPoint, RainMode } from "@/types/weather";
import { HourlyTable } from "../HourlyTable";
import { Panel } from "../Panel";
import { RainChart } from "../RainChart";
import { SegmentedControl } from "../SegmentedControl";
import { TempChart } from "../TempChart";
import styles from "./HourlyCharts.module.scss";

const RAIN_MODES = [
  { value: "prob", label: "Probabilidad" },
  { value: "mm", label: "Cantidad" },
] as const;

/** Seccion "Proximas 24 horas": temperatura, lluvia y tabla. Las dos graficas comparten la hora que se esta mirando. */
export function HourlyCharts({ points }: { points: readonly HourlyPoint[] }) {
  const headingId = useId();
  const [mode, setMode] = useState<RainMode>("prob");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const safeIndex = activeIndex !== null && activeIndex < points.length ? activeIndex : null;

  return (
    <section aria-labelledby={headingId} className={styles.section}>
      <h2 id={headingId} className={styles.heading}>
        Próximas 24 horas
      </h2>
      <Panel title="Temperatura en °C">
        <TempChart points={points} activeIndex={safeIndex} onActiveChange={setActiveIndex} />
      </Panel>
      <Panel
        title={mode === "prob" ? "Probabilidad de lluvia" : "Lluvia esperada por hora"}
        actions={<SegmentedControl label="Medida de lluvia" options={RAIN_MODES} value={mode} onChange={setMode} />}
      >
        <RainChart points={points} mode={mode} activeIndex={safeIndex} onActiveChange={setActiveIndex} />
      </Panel>
      <HourlyTable points={points} />
    </section>
  );
}
