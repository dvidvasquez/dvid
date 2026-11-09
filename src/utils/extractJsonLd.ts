const JSON_LD_BLOCK = /<script\b[^>]*\btype\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi;

const OPENING_WRAPPER = /^\s*(?:<!--|(?:\/\/|\/\*)?\s*<!\[CDATA\[\s*(?:\*\/)?)/;
const CLOSING_WRAPPER = /(?:-->|(?:\/\/|\/\*)?\s*\]\]>\s*(?:\*\/)?)\s*$/;

/**
 * Datos estructurados (`<script type="application/ld+json">`) de una pagina HTML.
 * Cada bloque valido da un valor; los que no son JSON se ignoran.
 */
export function extractJsonLd(html: string): unknown[] {
  const blocks: unknown[] = [];

  for (const match of html.matchAll(JSON_LD_BLOCK)) {
    // Algunos sitios envuelven el JSON en un comentario HTML o en CDATA (con o sin comentario JS).
    const text = match[1].replace(OPENING_WRAPPER, "").replace(CLOSING_WRAPPER, "");
    try {
      blocks.push(JSON.parse(text.trim()));
    } catch {
      // Bloque roto: se sigue con el siguiente.
    }
  }

  return blocks;
}
