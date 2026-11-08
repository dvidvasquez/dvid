import type { CSSProperties } from "react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import type { CurrentConditions, DailyPoint, Place } from "@/types/weather";
import { describeWeather } from "@/utils/describeWeather";
import { getSkyColors } from "@/utils/getSkyColors";
import type { LiveStatus } from "@/utils/getLiveStatus";
import { IconButton } from "../IconButton";
import { WeatherIcon } from "../WeatherIcon";
import styles from "./WeatherCard.module.scss";

type WeatherCardProps = {
  places: readonly Place[];
  placeId: string;
  onPlaceChange: (id: string) => void;
  current: CurrentConditions | null;
  today: DailyPoint | null;
  outlook: string | null;
  stampText: string;
  status: LiveStatus;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  /** `true` mientras se muestran datos de otro lugar y llegan los del elegido. */
  loading: boolean;
};

/** Tarjeta flotante con el clima de ahora. El cielo cambia de color segun el tiempo y la hora. */
export function WeatherCard({
  places,
  placeId,
  onPlaceChange,
  current,
  today,
  outlook,
  stampText,
  status,
  collapsed,
  onToggleCollapsed,
  loading,
}: WeatherCardProps) {
  const weather = current ? describeWeather(current.code) : null;
  const [skyA, skyB] = getSkyColors(weather?.kind ?? "clear", current?.isDay ?? true);
  const classes = [styles.card, collapsed ? styles.collapsed : "", loading ? styles.loading : ""]
    .filter(Boolean)
    .join(" ");
  const toggleLabel = collapsed ? "Mostrar panel del clima" : "Ocultar panel del clima";

  return (
    <div
      className={classes}
      style={{ "--sky-a": skyA, "--sky-b": skyB } as CSSProperties}
      aria-busy={loading || undefined}
      onClick={collapsed ? onToggleCollapsed : undefined}
    >
      <IconButton
        tone="overlay"
        size="sm"
        className={styles.toggle}
        label={toggleLabel}
        aria-expanded={!collapsed}
        onClick={(event) => {
          event.stopPropagation();
          onToggleCollapsed();
        }}
      >
        <ChevronUpIcon aria-hidden="true" />
      </IconButton>

      <div className={styles.top}>
        <label className={styles.srOnly} htmlFor="clima-place">
          Lugar del Valle de Aburrá
        </label>
        <select
          id="clima-place"
          className={styles.select}
          value={placeId}
          onChange={(event) => onPlaceChange(event.target.value)}
        >
          {places.map((place) => (
            <option key={place.id} value={place.id}>
              {place.name}
            </option>
          ))}
        </select>
        <p className={styles.stamp} aria-live="polite">
          <span className={`${styles.live} ${status === "live" ? "" : styles[status]}`} aria-hidden="true" />
          <span>{stampText}</span>
        </p>
      </div>

      <div className={styles.now}>
        <p className={styles.temp} aria-live="polite">
          <span>{current ? Math.round(current.temperature) : "–"}</span>
          <span className={styles.deg}>°</span>
        </p>
        <div className={styles.cond}>
          <span className={styles.icon}>{weather && current ? <WeatherIcon kind={weather.kind} isDay={current.isDay} /> : null}</span>
          <div className={styles.condText}>
            <p className={styles.condLabel}>{weather ? weather.label : "Cargando datos"}</p>
            <p className={styles.condSub}>
              {current && today
                ? `Sensación de ${Math.round(current.apparent)}°. Hoy entre ${Math.round(today.min)}° y ${Math.round(today.max)}°.`
                : " "}
            </p>
          </div>
        </div>
      </div>

      <p className={styles.outlook}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3.2c3.3 4 5.5 6.9 5.5 10a5.5 5.5 0 0 1-11 0c0-3.1 2.2-6 5.5-10z" />
        </svg>
        <span>{outlook ?? "Consultando la lluvia de las próximas horas…"}</span>
      </p>
    </div>
  );
}
