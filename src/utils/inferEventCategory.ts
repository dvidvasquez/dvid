import { EVENT_GENRE_ARTISTS, EVENT_GENRE_VENUES } from "@/constants/events";
import type { EventCategory } from "@/types/event";
import { foldText } from "./foldText";

// Todos los patrones se aplican sobre texto ya sin tildes ni mayusculas.
const GENRES: ReadonlyArray<readonly [EventCategory, RegExp]> = [
  ["punk", /\b(punk\w*|hardcore|ska|crust|oi!)(?=\W|$)/],
  ["metal", /\b(metal|metalero|metalcore|deathcore|thrash|doom|sludge|grindcore|headbanger)\b/],
  ["rock", /\b(rock|rockero|rockabilly|grunge|indie|alternativ[oa]|shoegaze|stoner|psicodeli[ac]\w*|psychedelic|new wave|britpop)\b/],
  [
    "electronica",
    /\b(electronic[ao]|electro|techno|(psy)?trance|rave|edm|dnb|drum (and|&|n) bass|dubstep|hardstyle|dj|djs|b2b|club night|house music|(deep|tech|afro|progressive|acid) house)\b/,
  ],
  ["urbano", /\b(reggaeton|regueton|trap|hip ?hop|rap|urban[oa]|dembow|perreo|drill|freestyle|dancehall|afrobeats?|rkt)\b/],
];

const TEATRO = /\b(teatro|theat(er|re)|obra|comedia|stand ?up|monologo|danza|ballet|opera|circo|titeres|performance)\b/;
const MUSICA = /\b(concert[so]?|concierto|music|musica|musical|symphony|sinfonic[ao]|orquesta|jazz|salsa|bolero|tango|vallenato|cumbia|recital)\b/;
const FERIA = /\b(feria|festival|fair|market|mercado|gastronom\w*|food|empanada|flores|carnaval|bazar|fiesta|desfile|parade|convencion|cosplay)\b/;

const DESCRIPTION_CHARS = 400;

const GENERIC: ReadonlySet<EventCategory> = new Set(["musica", "otro"]);

function findGenre(text: string): EventCategory | null {
  return GENRES.find(([, pattern]) => pattern.test(text))?.[0] ?? null;
}

/** Busca nombres completos (no trozos de palabra): "feid" no aparece en "feidad". */
function findHint(text: string, hints: ReadonlyArray<{ category: EventCategory; names: ReadonlyArray<string> }>): EventCategory | null {
  const padded = ` ${text.replace(/[^a-z0-9]+/g, " ").trim()} `;
  return hints.find(({ names }) => names.some((name) => padded.includes(` ${name} `)))?.category ?? null;
}

function inferFromText(name: string, labels: string, description: string): EventCategory {
  const head = `${name} ${labels}`;

  const genre = findGenre(head) ?? findHint(name, EVENT_GENRE_ARTISTS);
  if (genre) return genre;
  if (TEATRO.test(head)) return "teatro";
  if (FERIA.test(name) && !MUSICA.test(name)) return "feria";
  if (MUSICA.test(head)) return findGenre(foldText(description).slice(0, DESCRIPTION_CHARS)) ?? "musica";
  if (FERIA.test(labels)) return "feria";
  return "otro";
}

/**
 * Categoria de la agenda a partir del titulo, las categorias de la fuente y, solo para afinar el
 * genero de un concierto, el principio de la descripcion. Si el titulo no dice el genero se usan las
 * pistas locales: una banda o festival conocido en el titulo o, si quedo en musica u otro, un sitio
 * dedicado a un genero.
 */
export function inferEventCategory({
  title,
  categories = [],
  description = "",
  venue = "",
}: {
  title: string;
  categories?: string[];
  description?: string;
  venue?: string;
}): EventCategory {
  const category = inferFromText(foldText(title), foldText(categories.join(" ")), description);
  if (!GENERIC.has(category)) return category;
  return findHint(foldText(venue), EVENT_GENRE_VENUES) ?? category;
}
