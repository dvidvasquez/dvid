const PAGE_DATA = "/page-data/";
const HASH = /^[A-Za-z0-9_-]{1,40}$/;

/**
 * Un sitio Gatsby guarda los datos de cada pagina en `…/page-data/<ruta>/page-data.json`; ese JSON
 * nombra en `staticQueryHashes` las consultas que la pagina comparte con otras, cada una en
 * `…/page-data/sq/d/<hash>.json` (ahi suelen estar las listas completas). Da esas direcciones a
 * partir del texto de un `page-data.json` y de su URL; si no es uno, da una lista vacia.
 */
export function getGatsbyStaticQueryUrls(text: string, pageDataUrl: string): string[] {
  const cut = pageDataUrl.indexOf(PAGE_DATA);
  if (cut < 0) return [];

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return [];
  }
  const hashes = typeof data === "object" && data !== null ? (data as Record<string, unknown>).staticQueryHashes : undefined;
  if (!Array.isArray(hashes)) return [];

  const base = pageDataUrl.slice(0, cut + PAGE_DATA.length);
  const valid = hashes.filter((hash): hash is string => typeof hash === "string" && HASH.test(hash));
  return [...new Set(valid)].map((hash) => `${base}sq/d/${hash}.json`);
}
