import type { HourlyPoint } from "@/types/weather";
import { formatLocalTime } from "@/utils/formatLocalTime";
import { formatMillimeters } from "@/utils/formatMillimeters";
import { formatPercent } from "@/utils/formatPercent";
import { getHourDayWord } from "@/utils/getHourDayWord";
import styles from "./HourlyTable.module.scss";

/** Los mismos datos de las graficas en una tabla, para quien no puede o no quiere usar las graficas. */
export function HourlyTable({ points }: { points: readonly HourlyPoint[] }) {
  if (points.length === 0) return null;
  return (
    <details className={styles.details}>
      <summary className={styles.summary}>Ver estos datos en tabla</summary>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Hora</th>
              <th>Temp.</th>
              <th>Prob. lluvia</th>
              <th>Lluvia</th>
            </tr>
          </thead>
          <tbody>
            {points.map((point) => (
              <tr key={point.time}>
                <td>{`${getHourDayWord(points[0].time, point.time)} ${formatLocalTime(point.time)}`}</td>
                <td>{Math.round(point.temperature)}°</td>
                <td>{formatPercent(point.precipProbability)}</td>
                <td>{formatMillimeters(point.precipitation)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
