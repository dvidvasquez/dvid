import type { ReactNode } from "react";
import { CHART_MARGIN } from "@/constants/chart";
import type { ChartScale } from "@/types/weather";
import { formatHour } from "@/utils/formatHour";
import { getChartX } from "@/utils/getChartX";
import { getChartY } from "@/utils/getChartY";
import { getScaleTicks } from "@/utils/getScaleTicks";
import { getXAxisStride } from "@/utils/getXAxisStride";
import { parseLocalTime } from "@/utils/parseLocalTime";
import styles from "./ChartAxes.module.scss";

type ChartAxesProps = {
  scale: ChartScale;
  width: number;
  height: number;
  /** Hora local (`YYYY-MM-DDTHH:mm`) de cada punto, en orden. */
  times: readonly string[];
  formatTick: (value: number) => string;
};

/** Lineas guia con sus valores a la izquierda y las horas debajo. Va dentro de un `<svg>`. */
export function ChartAxes({ scale, width, height, times, formatTick }: ChartAxesProps) {
  const count = times.length;
  const stride = getXAxisStride(width - CHART_MARGIN.left - CHART_MARGIN.right, count);
  const hourLabels: ReactNode[] = [];
  for (let i = 0; i < count; i += stride) {
    const x = getChartX(i, width, count);
    hourLabels.push(
      <text
        key={i}
        x={i === 0 ? x - 12 : x}
        y={height - 6}
        textAnchor={i === 0 ? "start" : i >= count - 1 ? "end" : "middle"}
        className={styles.text}
      >
        {i === 0 ? "Ahora" : formatHour(parseLocalTime(times[i]).hour)}
      </text>,
    );
  }

  return (
    <>
      {getScaleTicks(scale).map((value) => {
        const y = getChartY(value, scale, height);
        return (
          <g key={value}>
            <line
              x1={CHART_MARGIN.left}
              x2={width - CHART_MARGIN.right}
              y1={y}
              y2={y}
              className={value === scale.min ? styles.axis : styles.grid}
            />
            <text x={CHART_MARGIN.left - 10} y={y + 4} textAnchor="end" className={styles.text}>
              {formatTick(value)}
            </text>
          </g>
        );
      })}
      {hourLabels}
    </>
  );
}
