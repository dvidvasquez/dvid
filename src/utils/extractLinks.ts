const HREF = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
/** Entrada de un sitemap: `<url><loc>…</loc><lastmod>…</lastmod></url>`. */
const SITEMAP_ENTRY = /<url\b[^>]*>([\s\S]*?)<\/url\s*>/gi;
const LOC = /<loc\b[^>]*>\s*([^<\s]+)\s*<\/loc\s*>/i;
const LASTMOD = /<lastmod\b[^>]*>\s*([^<\s]+)\s*<\/lastmod\s*>/i;

function decodeEntities(text: string): string {
  return text.replace(/&amp;/g, "&");
}

/** Direccion absoluta, sin `#…`, solo si es del mismo sitio que la pagina y contiene el texto pedido. */
function toSameSiteUrl(raw: string, base: URL, contains: string): string | null {
  let url: URL;
  try {
    url = new URL(decodeEntities(raw.trim()), base);
  } catch {
    return null;
  }
  if (url.origin !== base.origin) return null;
  url.hash = "";
  return url.href.includes(contains) ? url.href : null;
}

/**
 * Enlaces de una pagina HTML (`href`) o de un sitemap (`<loc>`) que son del mismo sitio y contienen
 * `contains` (por ejemplo `/agenda/evento/`). Salen sin repetir; los de un sitemap con `<lastmod>`,
 * del mas reciente al mas viejo, para leer primero lo que acaba de publicarse.
 */
export function extractLinks(text: string, pageUrl: string, contains: string): string[] {
  let base: URL;
  try {
    base = new URL(pageUrl);
  } catch {
    return [];
  }

  const entries: Array<{ url: string; lastmod: string }> = [];
  for (const match of text.matchAll(SITEMAP_ENTRY)) {
    const url = toSameSiteUrl(match[1].match(LOC)?.[1] ?? "", base, contains);
    if (url) entries.push({ url, lastmod: match[1].match(LASTMOD)?.[1] ?? "" });
  }
  // Las fechas ISO se ordenan como texto; las entradas sin fecha quedan al final, en su orden.
  entries.sort((a, b) => (a.lastmod < b.lastmod ? 1 : a.lastmod > b.lastmod ? -1 : 0));

  const links = new Set(entries.map(({ url }) => url));
  for (const match of text.matchAll(HREF)) {
    const url = toSameSiteUrl(match[1] ?? match[2] ?? "", base, contains);
    if (url) links.add(url);
  }
  return [...links];
}
