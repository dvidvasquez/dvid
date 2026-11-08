import { useId, type ReactNode } from "react";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { NBSP } from "@/constants/text";
import type { CurrentConditions, DailyPoint } from "@/types/weather";
import { formatLocalTime } from "@/utils/formatLocalTime";
import { formatMillimeters } from "@/utils/formatMillimeters";
import { formatPercent } from "@/utils/formatPercent";
import { getCloudLabel } from "@/utils/getCloudLabel";
import { getCompassPoint } from "@/utils/getCompassPoint";
import { getFeelsLikeLabel } from "@/utils/getFeelsLikeLabel";
import { getHumidityLabel } from "@/utils/getHumidityLabel";
import { getUvLabel } from "@/utils/getUvLabel";
import styles from "./CurrentMetrics.module.scss";

type CurrentMetricsProps = {
  current: CurrentConditions;
  today: DailyPoint;
};

function Metric({ label, value, sub }: { label: string; value: ReactNode; sub: string }) {
  return (
    <div className={styles.metric}>
      <dt className={styles.term}>{label}</dt>
      <dd className={styles.value}>
        {value}
        <span className={styles.sub}>{sub}</span>
      </dd>
    </div>
  );
}

/** Seccion "Condiciones ahora": sensacion, humedad, viento, presion, nubes, lluvia, UV y sol. */
export function CurrentMetrics({ current, today }: CurrentMetricsProps) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className={styles.section}>
      <h2 id={headingId} className={styles.heading}>
        Condiciones ahora
      </h2>
      <p className={styles.note}>Datos del modelo de las {formatLocalTime(current.time)}</p>
      <dl className={styles.metrics}>
        <Metric
          label="Sensación térmica"
          value={`${Math.round(current.apparent)}°`}
          sub={getFeelsLikeLabel(current.apparent, current.temperature)}
        />
        <Metric label="Humedad" value={formatPercent(current.humidity)} sub={getHumidityLabel(current.humidity)} />
        <Metric
          label="Viento"
          value={
            <span className={styles.wind}>
              <ArrowUpIcon
                className={styles.windArrow}
                style={{ transform: `rotate(${current.windDirection + 180}deg)` }}
                aria-hidden="true"
              />
              <span>{`${Math.round(current.windSpeed)}${NBSP}km/h`}</span>
            </span>
          }
          sub={`Del ${getCompassPoint(current.windDirection)}, ráfagas de ${Math.round(current.windGusts)}${NBSP}km/h`}
        />
        <Metric label="Presión" value={`${Math.round(current.pressure)}${NBSP}hPa`} sub="En la superficie" />
        <Metric label="Nubosidad" value={formatPercent(current.cloudCover)} sub={getCloudLabel(current.cloudCover)} />
        <Metric label="Lluvia reciente" value={formatMillimeters(current.precipitation)} sub="En el último intervalo" />
        <Metric label="Índice UV máximo de hoy" value={String(Math.round(today.uvMax))} sub={getUvLabel(today.uvMax)} />
        <Metric
          label="Salida del sol"
          value={formatLocalTime(today.sunrise)}
          sub={`Se oculta a las ${formatLocalTime(today.sunset)}`}
        />
      </dl>
    </section>
  );
}
