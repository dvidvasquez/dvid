import type { ChartScale, RainMode } from "@/types/weather";

function niceStep(max: number): number {
  if (max <= 2) return 0.5;
  if (max <= 5) return 1;
  if (max <= 10) return 2;
  return 5;
}

/** Probabilidad: siempre 0-100 %. Milimetros: el tope se ajusta a los datos (minimo 1 mm). */
export function getRainScale(mode: RainMode, values: readonly number[]): ChartScale {
  if (mode === "prob") return { min: 0, max: 100, step: 50 };
  const peak = Math.max(1, ...values);
  const step = niceStep(peak);
  return { min: 0, max: Math.ceil(peak / step) * step, step };
}
