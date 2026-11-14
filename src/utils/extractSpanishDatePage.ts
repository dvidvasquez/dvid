import { EVENTS_UTC_OFFSET } from "@/constants/events";
import type { JsonLdNode } from "./collectJsonLdEvents";
import { foldText } from "./foldText";
import { stripHtml } from "./stripHtml";
import { toDayKey } from "./toDayKey";

const HEADING = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1\s*>/gi;
const META = /<meta\b[^>]*>/gi;
const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
// Sobre texto sin tildes ni mayusculas: "sabado 14 de noviembre", "14 de noviembre de 2026".
const DATE = new RegExp(`\\b(\\d{1,2}) de (${MONTHS.join("|")}|setiembre)(?: (?:de|del) (\\d{4}))?\\b`);
const TIME = /\b(\d{1,2}):(\d{2}) ?([ap])\.? ?m\b/;
const FREE = /\b(entrada libre|gratis|gratuito|sin costo)\b/;
const DAY_MS = 86_400_000;
/** Una fecha sin año que ya paso hace mas de esto se toma como del año siguiente. */
const PAST_TOLERANCE_DAYS = 60;

type Heading = { level: number; text: string; folded: string };

function readHeadings(html: string): Heading[] {
  const headings: Heading[] = [];
  for (const match of html.matchAll(HEADING)) {
    const text = stripHtml(match[2]);
    if (text) headings.push({ level: Number(match[1]), text, folded: foldText(text) });
  }
  return headings;
}

function readMeta(html: string, key: string): string {
  for (const [tag] of html.matchAll(META)) {
    if (!new RegExp(`\\b(?:property|name)\\s*=\\s*["']${key}["']`, "i").test(tag)) continue;
    const content = tag.match(/\bcontent\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
    if (content) return stripHtml(content[1] ?? content[2] ?? "");
  }
  return "";
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** Dia `YYYY-MM-DD`; sin año se elige el que deja la fecha mas cerca de hoy sin haber pasado hace mucho. */
function toDay(match: RegExpMatchArray, nowMs: number): string | null {
  const day = Number(match[1]);
  const month = (match[2] === "setiembre" ? 8 : MONTHS.indexOf(match[2])) + 1;
  if (day < 1 || day > 31 || month < 1) return null;
  if (match[3]) return `${match[3]}-${pad(month)}-${pad(day)}`;

  const year = Number(toDayKey(nowMs).slice(0, 4));
  const thisYear = `${year}-${pad(month)}-${pad(day)}`;
  return Date.parse(thisYear) < nowMs - PAST_TOLERANCE_DAYS * DAY_MS ? `${year + 1}-${pad(month)}-${pad(day)}` : thisYear;
}

function toClock(match: RegExpMatchArray): string | null {
  const hour = (Number(match[1]) % 12) + (match[3] === "p" ? 12 : 0);
  return hour < 24 && Number(match[2]) < 60 ? `${pad(hour)}:${match[2]}` : null;
}

/**
 * Ficha de un evento que solo trae texto: el titulo en el `<h1>` (o en `og:title`) y la fecha escrita
 * en español en algun titulo de la pagina ("Sábado 14 de noviembre", "10:00 a. m."). El titulo que
 * sigue a la fecha, si no es la hora, se toma como el lugar. Sin año se supone la fecha mas cercana.
 * Da `null` si no hay titulo o fecha.
 */
export function extractSpanishDatePage(html: string, nowMs: number): JsonLdNode | null {
  const headings = readHeadings(html);
  const name = headings.find(({ level }) => level === 1)?.text || readMeta(html, "og:title");
  if (!name) return null;

  const dateIndex = headings.findIndex(({ level, folded }) => level > 1 && DATE.test(folded));
  const dateMatch = dateIndex >= 0 ? headings[dateIndex].folded.match(DATE) : null;
  const day = dateMatch ? toDay(dateMatch, nowMs) : null;
  if (!day) return null;

  const details = headings.slice(dateIndex);
  const timeMatch = details.map(({ folded }) => folded.match(TIME)).find(Boolean);
  const clock = timeMatch ? toClock(timeMatch) : null;
  const node: JsonLdNode = { "@type": "Event", name, startDate: clock ? `${day}T${clock}:00${EVENTS_UTC_OFFSET}` : day };

  const next = headings[dateIndex + 1];
  if (next && !TIME.test(next.folded) && !DATE.test(next.folded)) node.location = next.text;

  const image = readMeta(html, "og:image");
  if (image) node.image = image;
  const description = readMeta(html, "og:description") || readMeta(html, "description");
  if (description) node.description = description;
  if (headings.some(({ folded }) => FREE.test(folded))) node.isAccessibleForFree = true;

  return node;
}
