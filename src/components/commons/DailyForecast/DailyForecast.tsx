import { useId } from "react";
import type { DailyPoint } from "@/types/weather";
import { describeWeather } from "@/utils/describeWeather";
import { formatMillimeters } from "@/utils/formatMillimeters";
import { formatPercent } from "@/utils/formatPercent";
import { getDayLabel } from "@/utils/getDayLabel";
import { getRangeBar } from "@/utils/getRangeBar";
import { Panel } from "../Panel";
import { WeatherIcon } from "../WeatherIcon";
import styles from "./DailyForecast.module.scss";

/** Seccion "Proximos 7 dias": icono, lluvia y barra de minima-maxima de cada dia. */
export function DailyForecast({ days }: { days: readonly DailyPoint[] }) {
  const headingId = useId();
  const weekMin = Math.min(...days.map((day) => day.min));
  const weekMax = Math.max(...days.map((day) => day.max));

  return (
    <section aria-labelledby={headingId} className={styles.section}>
      <h2 id={headingId} className={styles.heading}>
        Próximos 7 días
      </h2>
      <Panel className={styles.panel}>
        {days.map((day, i) => {
          const weather = describeWeather(day.code);
          const bar = getRangeBar(day.min, day.max, weekMin, weekMax);
          return (
            <div key={day.date} className={styles.day}>
              <span className={styles.name}>{getDayLabel(day.date, i)}</span>
              <span className={styles.icon} title={weather.label}>
                <WeatherIcon kind={weather.kind} isDay />
              </span>
              <span className={styles.rain}>
                <b className={styles.rainValue}>{formatPercent(day.precipProbMax)}</b> de lluvia
                <br />
                {formatMillimeters(day.precipSum)} en el día
              </span>
              <span className={styles.range}>
                <span className={styles.low}>{Math.round(day.min)}°</span>
                <span className={styles.track}>
                  <i className={styles.fill} style={{ left: `${bar.left.toFixed(1)}%`, width: `${bar.width.toFixed(1)}%` }} />
                </span>
                <span className={styles.high}>{Math.round(day.max)}°</span>
              </span>
            </div>
          );
        })}
      </Panel>
    </section>
  );
}
