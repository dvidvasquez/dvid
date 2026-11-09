import type { EventCategory } from "@/types/event";
import { foldText } from "./foldText";

// Todos los patrones se aplican sobre texto ya sin tildes ni mayusculas.
const GENRES: ReadonlyArray<readonly [EventCategory, RegExp]> = [
  ["punk", /\b(punk|hardcore|ska|crust|oi!)(?=\W|$)/],
  ["metal", /\b(metal|metalero|thrash|doom|sludge|grindcore|headbanger)\b/],
  ["rock", /\b(rock|rockero|grunge|indie|alternativ[oa]|shoegaze)\b/],
  [
    "electronica",
    /\b(electronic[ao]|electro|techno|trance|rave|edm|dnb|drum and bass|dj|house music|(deep|tech|afro|progressive|acid) house)\b/,
  ],
  ["urbano", /\b(reggaeton|regueton|trap|hip ?hop|rap|urban[oa]|dembow|perreo|drill|freestyle)\b/],
];

const TEATRO = /\b(teatro|theat(er|re)|obra|comedia|stand ?up|monologo|danza|ballet|opera|circo|titeres|performance)\b/;
const MUSICA = /\b(concert[so]?|concierto|music|musica|musical|symphony|sinfonic[ao]|orquesta|jazz|salsa|bolero|tango|vallenato|cumbia|recital)\b/;
const FERIA = /\b(feria|festival|fair|market|mercado|gastronom\w*|food|empanada|flores|carnaval|bazar|fiesta|desfile|parade|convencion|cosplay)\b/;

const DESCRIPTION_CHARS = 400;

function findGenre(text: string): EventCategory | null {
  return GENRES.find(([, pattern]) => pattern.test(text))?.[0] ?? null;
}

/**
 * Categoria de la agenda a partir del titulo, las categorias de la fuente y, solo para
 * afinar el genero de un concierto, el principio de la descripcion.
 */
export function inferEventCategory({
  title,
  categories = [],
  description = "",
}: {
  title: string;
  categories?: string[];
  description?: string;
}): EventCategory {
  const name = foldText(title);
  const labels = foldText(categories.join(" "));
  const head = `${name} ${labels}`;

  const genre = findGenre(head);
  if (genre) return genre;
  if (TEATRO.test(head)) return "teatro";
  if (FERIA.test(name) && !MUSICA.test(name)) return "feria";
  if (MUSICA.test(head)) return findGenre(foldText(description).slice(0, DESCRIPTION_CHARS)) ?? "musica";
  if (FERIA.test(labels)) return "feria";
  return "otro";
}
