const FREE = /gratis|libre|free/i;

/** `25.000` o `25,000` son miles (pesos); lo que quede con coma es decimal. */
function toAmount(raw: string): number {
  return Number(raw.replace(/[.,](?=\d{3}(?!\d))/g, "").replace(",", "."));
}

/**
 * Precio minimo en pesos a partir del texto de la fuente (`$ 25.000`, `Gratis`,
 * `$ 30.000 - $ 80.000`). `0` es gratis; `null` es que no se pudo saber.
 */
export function parseEventPrice(cost: string | null | undefined, values: ReadonlyArray<string> = []): number | null {
  const text = cost?.trim() ?? "";
  if (FREE.test(text)) return 0;

  const fromText = text.match(/\d[\d.,]*/g)?.map(toAmount) ?? [];
  const amounts = (fromText.length > 0 ? fromText : values.map(toAmount)).filter((n) => Number.isFinite(n) && n >= 0);
  return amounts.length > 0 ? Math.min(...amounts) : null;
}
