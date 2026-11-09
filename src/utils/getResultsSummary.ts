/** `12, 3` -> `12 eventos en 3 días`; `1, 1` -> `1 evento en 1 día`; `0, 0` -> `Sin eventos`. */
export function getResultsSummary(eventCount: number, dayCount: number): string {
  if (eventCount === 0) return "Sin eventos";
  const events = `${eventCount} ${eventCount === 1 ? "evento" : "eventos"}`;
  const days = `${dayCount} ${dayCount === 1 ? "día" : "días"}`;
  return `${events} en ${days}`;
}
