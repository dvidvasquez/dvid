/** Codigos WMO de llovizna, lluvia, chubascos y tormenta (51-67 y 80-99). */
export function isWetCode(code: number): boolean {
  return (code >= 51 && code <= 67) || (code >= 80 && code <= 99);
}
