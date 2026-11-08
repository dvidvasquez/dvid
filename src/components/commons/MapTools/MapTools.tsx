import { ArrowPathIcon, CameraIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { IconButton } from "../IconButton";
import styles from "./MapTools.module.scss";

type MapToolsProps = {
  refreshing: boolean;
  onRefresh: () => void;
  webcamsEnabled: boolean;
  onToggleWebcams: () => void;
  sheetOpen: boolean;
  onToggleSheet: () => void;
  /** En escritorio, deja libre el panel de detalles. */
  shifted: boolean;
};

/** Botones flotantes del mapa: actualizar, camaras publicas y detalles. */
export function MapTools({
  refreshing,
  onRefresh,
  webcamsEnabled,
  onToggleWebcams,
  sheetOpen,
  onToggleSheet,
  shifted,
}: MapToolsProps) {
  return (
    <div className={[styles.tools, shifted ? styles.shifted : ""].filter(Boolean).join(" ")}>
      <IconButton label="Actualizar ahora" busy={refreshing} onClick={onRefresh}>
        <ArrowPathIcon aria-hidden="true" />
      </IconButton>
      <IconButton
        label={webcamsEnabled ? "Ocultar cámaras públicas" : "Mostrar cámaras públicas"}
        aria-pressed={webcamsEnabled}
        onClick={onToggleWebcams}
      >
        <CameraIcon aria-hidden="true" />
      </IconButton>
      <IconButton label="Ver detalles" aria-expanded={sheetOpen} onClick={onToggleSheet}>
        <ChartBarIcon aria-hidden="true" />
      </IconButton>
    </div>
  );
}
