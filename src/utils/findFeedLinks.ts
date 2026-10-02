const FEED_TYPES = ["application/rss+xml", "application/atom+xml", "application/rdf+xml"];

function getAttribute(tag: string, name: string): string | undefined {
  const match = tag.match(new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return match ? (match[1] ?? match[2] ?? match[3]) : undefined;
}

/** Busca los feeds anunciados con <link rel="alternate"> en el HTML de una pagina. */
export function findFeedLinks(html: string, baseUrl: string): string[] {
  const links: string[] = [];

  for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
    const rel = getAttribute(tag, "rel")?.toLowerCase() ?? "";
    const type = getAttribute(tag, "type")?.toLowerCase() ?? "";
    const href = getAttribute(tag, "href");

    if (!rel.split(/\s+/).includes("alternate") || !FEED_TYPES.includes(type) || !href) continue;
    if (/comments?\/feed|comentarios/i.test(href)) continue;

    try {
      const url = new URL(href.replace(/&amp;/g, "&"), baseUrl);
      if ((url.protocol === "https:" || url.protocol === "http:") && !links.includes(url.href)) {
        links.push(url.href);
      }
    } catch {
      // href invalido: se ignora
    }
  }

  return links;
}
