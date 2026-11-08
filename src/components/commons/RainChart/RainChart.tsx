import { CHART_MARGIN, RAIN_CHART_HEIGHT } from "@/constants/chart";
import { NBSP } from "@/constants/text";
import type { HourlyPoint, RainMode } from "@/types/weather";
import { buildBarPath } from "@/utils/buildBarPath";
import { formatLocalTime } from "@/utils/formatLocalTime";
import { formatMillimeters } from "@/utils/formatMillimeters";
import { formatPercent } from "@/utils/formatPercent";
import { getBarWidth } from "@/utils/getBarWidth";
import { getChartX } from "@/utils/getChartX";
import { getChartY } from "@/utils/getChartY";
import { getHourDayWord } from "@/utils/getHourDayWord";
import { getRainScale } from "@/utils/getRainScale";
import { ChartAxes } from "../ChartAxes";
import { ChartFrame } from "../ChartFrame";
import styles from "./RainChart.module.scss";

type RainChartProps = {
  points: readonly HourlyPoint[];
  mode: RainMode;
  activeIndex: number | null;
  onActiveChange: (index: number | null) => void;
};

const H = RAIN_CHART_HEIGHT;

/** Barras por hora con la probabilidad de lluvia (%) o la cantidad esperada (mm). */
export function RainChart({ points, mode, activeIndex, onActiveChange }: RainChartProps) {
  const count = points.length;
  if (count < 2) return null;

  const values = points.map((point) => (mode === "prob" ? point.precipProbability : point.precipitation));
  const scale = getRainScale(mode, values);
  const active = activeIndex !== null ? (points[activeIndex] ?? null) : null;
  const activeHasBar = activeIndex !== null && (values[activeIndex] ?? 0) > 0;

  return (
    <ChartFrame
      height={H}
      count={count}
      activeIndex={active ? activeIndex : null}
      onActiveChange={onActiveChange}
      label={
        mode === "prob"
          ? "Gráfica de probabilidad de lluvia por hora de las próximas 24 horas. Usa las flechas para recorrer las horas."
          : "Gráfica de milímetros de lluvia por hora de las próximas 24 horas. Usa las flechas para recorrer las horas."
      }
      tooltip={
        active
          ? {
              title: `${getHourDayWord(points[0].time, active.time)} ${formatLocalTime(active.time)}`,
              rows: [
                { key: "rain", value: formatPercent(active.precipProbability), label: "prob. de lluvia" },
                { key: "rain", value: formatMillimeters(active.precipitation), label: "cantidad esperada" },
              ],
            }
          : null
      }
    >
      {(width) => {
        const slot = (width - CHART_MARGIN.left - CHART_MARGIN.right) / (count - 1);
        const barWidth = getBarWidth(slot);
        const baseY = getChartY(0, scale, H);
        return (
          <>
            <ChartAxes
              scale={scale}
              width={width}
              height={H}
              times={points.map((point) => point.time)}
              formatTick={(value) => (mode === "prob" ? `${value}${NBSP}%` : formatMillimeters(value))}
            />
            <g className={activeHasBar ? styles.hasActive : undefined}>
              {values.map((value, i) =>
                value > 0 ? (
                  <path
                    key={points[i].time}
                    d={buildBarPath(getChartX(i, width, count), barWidth, baseY, getChartY(Math.min(value, scale.max), scale, H))}
                    className={[styles.bar, i === activeIndex ? styles.on : ""].filter(Boolean).join(" ")}
                  />
                ) : null,
              )}
            </g>
          </>
        );
      }}
    </ChartFrame>
  );
}
