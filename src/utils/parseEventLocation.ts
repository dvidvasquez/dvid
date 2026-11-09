import { foldText } from "./foldText";

export type EventLocation = { venue: string; municipality: string | null };

/**
 * `Sitio, Calle 47 #43 88, Medellín, Antioquia, Colombia` -> sitio y municipio.
 * El sitio es el primer tramo (sin el "Private:" que agrega The Events Calendar);
 * el municipio es el ultimo tramo que no sea pais, departamento ni una direccion con numero.
 */
export function parseEventLocation(location: string): EventLocation {
  const parts = location
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const [first = "", ...rest] = parts;
  const venue = first.replace(/^(private|privado):\s*/i, "");

  while (rest.length > 0) {
    const last = foldText(rest[rest.length - 1]);
    if (last !== "colombia" && last !== "antioquia") break;
    rest.pop();
  }

  const candidate = rest[rest.length - 1];
  return { venue, municipality: candidate && !/\d/.test(candidate) ? candidate : null };
}
