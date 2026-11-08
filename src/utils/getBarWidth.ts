/** Ancho de barra segun el espacio entre horas: entre 4 y 20 px. */
export function getBarWidth(slot: number): number {
  return Math.max(4, Math.min(20, slot - 4));
}
