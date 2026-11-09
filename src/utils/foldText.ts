/** Minusculas y sin tildes, para comparar texto: `Electrónica` -> `electronica`. */
export function foldText(text: string): string {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}
