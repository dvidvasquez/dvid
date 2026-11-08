import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import type { RadarFrame } from "@/types/weather";
import { getRadarStatusText } from "@/utils/getRadarStatusText";
import styles from "./RadarBar.module.scss";

type RadarBarProps = {
  /** `null` mientras no ha llegado ninguna respuesta. */
  frames: readonly RadarFrame[] | null;
  status: "loading" | "ready" | "error";
  index: number;
  playing: boolean;
  now: number;
  onTogglePlay: () => void;
  onSeek: (index: number) => void;
  /** En escritorio, deja libre el panel de detalles. */
  shifted: boolean;
};

/** Barra inferior del mapa: reproducir la animacion del radar, elegir el momento y ver su hora. */
export function RadarBar({ frames, status, index, playing, now, onTogglePlay, onSeek, shifted }: RadarBarProps) {
  const count = frames?.length ?? 0;
  const max = Math.max(0, count - 1);
  return (
    <div className={[styles.bar, shifted ? styles.shifted : ""].filter(Boolean).join(" ")}>
      <button
        type="button"
        className={styles.play}
        aria-label={playing ? "Pausar animación" : "Reproducir animación de las últimas 2 horas"}
        disabled={count < 2}
        onClick={onTogglePlay}
      >
        {playing ? <PauseIcon aria-hidden="true" /> : <PlayIcon aria-hidden="true" />}
      </button>
      <input
        type="range"
        className={styles.slider}
        min={0}
        max={max}
        step={1}
        value={Math.min(index, max)}
        disabled={count === 0}
        aria-label="Momento de la imagen del mapa"
        onChange={(event) => onSeek(Number(event.target.value))}
      />
      <p className={styles.time} aria-live="polite">
        {getRadarStatusText({ status, frames, index, now })}
      </p>
    </div>
  );
}
