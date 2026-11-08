import { isWetCode } from "./isWetCode";

/** Llueve ahora si cayo al menos 0,1 mm en el ultimo intervalo o el codigo es de lluvia. */
export function isRainingNow(precipitation: number, code: number): boolean {
  return precipitation >= 0.1 || isWetCode(code);
}
