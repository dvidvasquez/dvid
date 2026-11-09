import type { JsonLdPage } from "@/constants/eventSources";
import { toDayKey } from "@/utils/toDayKey";

const MONTH_PLACEHOLDER = "{month}";

/** `YYYY-MM` + `offset` meses. */
function addMonths(monthKey: string, offset: number): string {
  const [year, month] = monthKey.split("-").map(Number);
  const index = year * 12 + (month - 1) + offset;
  return `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, "0")}`;
}

/**
 * Las paginas que listan un mes por URL (`/eventos/month/2026-11/`) se declaran una vez con `{month}` y
 * `months`: salen una por cada mes desde el actual (hora de Colombia). Las demas quedan como estan.
 */
export function expandJsonLdPages(pages: JsonLdPage[], now: Date): JsonLdPage[] {
  const currentMonth = toDayKey(now.getTime()).slice(0, 7);

  return pages.flatMap((page) => {
    const { months, ...rest } = page;
    if (!months || months < 1 || !page.url.includes(MONTH_PLACEHOLDER) || !currentMonth) return [rest];
    return Array.from({ length: months }, (_, offset) => ({
      ...rest,
      url: page.url.replaceAll(MONTH_PLACEHOLDER, addMonths(currentMonth, offset)),
    }));
  });
}
