type SourceOutcome = { status: "ok" | "sin-eventos" | "error" };

/**
 * Texto para cuando la agenda no tiene eventos. Distingue "ninguna fuente respondio" de "las
 * fuentes respondieron pero no hay nada en el rango", porque lo que hay que hacer es distinto.
 */
export function getAgendaEmptyMessage(statuses: ReadonlyArray<SourceOutcome>, windowDays: number): string {
  const answered = statuses.filter(({ status }) => status !== "error").length;

  if (statuses.length === 0 || answered === 0) {
    return "No se pudo consultar ninguna fuente ahora. Se vuelve a intentar solo en unas horas.";
  }
  const failed = statuses.length - answered;
  const base = `Las fuentes respondieron, pero no hay eventos en los próximos ${windowDays} días.`;
  return failed > 0 ? `${base} ${failed === 1 ? "Una fuente no respondió." : `${failed} fuentes no respondieron.`}` : base;
}
