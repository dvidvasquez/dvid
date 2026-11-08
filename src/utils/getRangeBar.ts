export type RangeBar = { left: number; width: number };

/** Posicion (%) de la barra min-max de un dia dentro del rango de toda la semana. */
export function getRangeBar(min: number, max: number, weekMin: number, weekMax: number): RangeBar {
  const span = Math.max(1, weekMax - weekMin);
  return {
    left: ((min - weekMin) / span) * 100,
    width: Math.max(4, ((max - min) / span) * 100),
  };
}
