/** Compara la sensacion termica con la temperatura real. */
export function getFeelsLikeLabel(apparent: number, temperature: number): string {
  const diff = apparent - temperature;
  if (diff > 1) return "Se siente más calor";
  if (diff < -1) return "Se siente más fresco";
  return "Similar a la temperatura";
}
