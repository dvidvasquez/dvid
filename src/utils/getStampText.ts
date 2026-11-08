import { formatLocalTime } from "./formatLocalTime";
import { getAgeLabel } from "./getAgeLabel";

type StampInput = {
  /** Hora local (`YYYY-MM-DDTHH:mm`) del dato que se esta mostrando, si hay. */
  dataTime: string | null;
  error: boolean;
  fetchedAt: number;
  now: number;
};

/** Texto junto al punto de estado de la tarjeta del clima. */
export function getStampText({ dataTime, error, fetchedAt, now }: StampInput): string {
  if (error) return dataTime ? `Sin conexión, datos de las ${formatLocalTime(dataTime)}` : "No se pudo cargar el clima";
  if (!dataTime || !fetchedAt || !now) return "Conectando…";
  return `Actualizado ${getAgeLabel(fetchedAt, now)}`;
}
