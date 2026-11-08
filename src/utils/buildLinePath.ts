export type ChartPoint = { x: number; y: number };

export function buildLinePath(points: readonly ChartPoint[]): string {
  return `M${points.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("L")}`;
}
