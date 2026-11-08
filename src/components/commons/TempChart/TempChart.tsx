import { TEMP_CHART_HEIGHT } from "@/constants/chart";
import type { HourlyPoint } from "@/types/weather";
import { buildAreaPath } from "@/utils/buildAreaPath";
import { buildLinePath } from "@/utils/buildLinePath";
import { formatLocalTime } from "@/utils/formatLocalTime";
import { formatPercent } from "@/utils/formatPercent";
import { getChartX } from "@/utils/getChartX";
import { getChartY } from "@/utils/getChartY";
import { getHourDayWord } from "@/utils/getHourDayWord";
import { getTempScale } from "@/utils/getTempScale";
import { ChartAxes } from "../ChartAxes";
import { ChartFrame } from "../ChartFrame";
import styles from "./TempChart.module.scss";

type TempChartProps = {
  points: readonly HourlyPoint[];
  activeIndex: number | null;
  onActiveChange: (index: number | null) => void;
};

const H = TEMP_CHART_HEIGHT;

/** Temperatura de las proximas 24 horas, con maxima y minima marcadas. */
export function TempChart({ points, activeIndex, onActiveChange }: TempChartProps) {
  const count = points.length;
  if (count < 2) return null;

  const temps = points.map((point) => point.temperature);
  const high = Math.max(...temps);
  const low = Math.min(...temps);
  const highIndex = temps.indexOf(high);
  const lowIndex = temps.indexOf(low);
  const scale = getTempScale(temps);
  const active = activeIndex !== null ? (points[activeIndex] ?? null) : null;

  return (
    <ChartFrame
      height={H}
      count={count}
      activeIndex={active ? activeIndex : null}
      onActiveChange={onActiveChange}
      label={`Gráfica de temperatura de las próximas 24 horas. Mínima ${Math.round(low)} grados, máxima ${Math.round(high)} grados. Usa las flechas para recorrer las horas.`}
      tooltip={
        active
          ? {
              title: `${getHourDayWord(points[0].time, active.time)} ${formatLocalTime(active.time)}`,
              rows: [
                { key: "temp", value: `${Math.round(active.temperature)}°`, label: "temperatura" },
                { key: "rain", value: formatPercent(active.precipProbability), label: "prob. de lluvia" },
              ],
            }
          : null
      }
    >
      {(width) => {
        const x = (i: number) => getChartX(i, width, count);
        const y = (value: number) => getChartY(value, scale, H);
        const line = temps.map((temp, i) => ({ x: x(i), y: y(temp) }));
        return (
          <>
            <ChartAxes
              scale={scale}
              width={width}
              height={H}
              times={points.map((point) => point.time)}
              formatTick={(value) => `${value}°`}
            />
            <path d={buildAreaPath(line, y(scale.min))} className={styles.area} />
            <path d={buildLinePath(line)} className={styles.line} />
            {highIndex !== 0 ? (
              <>
                <text x={x(highIndex)} y={y(high) - 10} textAnchor="middle" className={styles.label}>
                  {Math.round(high)}°
                </text>
                <circle cx={x(highIndex)} cy={y(high)} r={4} className={styles.dot} />
              </>
            ) : null}
            {lowIndex !== 0 && lowIndex !== highIndex ? (
              <>
                <text x={x(lowIndex)} y={y(low) + 19} textAnchor="middle" className={styles.label}>
                  {Math.round(low)}°
                </text>
                <circle cx={x(lowIndex)} cy={y(low)} r={4} className={styles.dot} />
              </>
            ) : null}
            <circle cx={x(0)} cy={y(temps[0])} r={4.5} className={styles.dot} />
            {active && activeIndex !== null ? (
              <circle cx={x(activeIndex)} cy={y(active.temperature)} r={5} className={styles.dot} />
            ) : null}
          </>
        );
      }}
    </ChartFrame>
  );
}
