import { AGENDA_ZONE_PLACES, OUT_OF_ZONE_PLACES } from "@/constants/events";
import { foldText } from "./foldText";

function hasPlace(text: string, places: ReadonlyArray<string>): boolean {
  return places.some((place) => text.includes(` ${place} `));
}

/**
 * Si un evento es de la zona de la agenda, segun su municipio. Solo queda fuera lo que nombra otra
 * ciudad conocida (Bogotá, Cali...) y ninguna de la zona: sin municipio, o con un texto que no se
 * reconoce (un barrio, una direccion), se deja pasar, porque casi todas las fuentes son de Medellín.
 */
export function isInAgendaZone(municipality: string | null): boolean {
  if (!municipality) return true;

  // Entre espacios, para comparar palabras completas: "Cali" no es "Caldas" ni "California".
  const text = ` ${foldText(municipality).replace(/[^a-z0-9]+/g, " ").trim()} `;
  if (hasPlace(text, AGENDA_ZONE_PLACES)) return true;
  return !hasPlace(text, OUT_OF_ZONE_PLACES);
}
