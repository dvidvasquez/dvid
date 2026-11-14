/**
 * Direccion del `page-data.json` de una pagina de un sitio Gatsby: los datos con que Gatsby arma la
 * pagina, aunque el HTML llegue vacio. `prefix` es la carpeta donde vive el sitio (`/agenda`, o
 * vacio si esta en la raiz). Da `null` si la pagina no esta bajo ese prefijo.
 *
 * `https://sitio/agenda/evento/x/` con prefijo `/agenda` -> `https://sitio/agenda/page-data/evento/x/page-data.json`.
 */
export function toGatsbyPageDataUrl(pageUrl: string, prefix: string): string | null {
  let url: URL;
  try {
    url = new URL(pageUrl);
  } catch {
    return null;
  }

  const base = `/${prefix.split("/").filter(Boolean).join("/")}`.replace(/\/$/, "");
  if (base && url.pathname !== base && !url.pathname.startsWith(`${base}/`)) return null;

  const path = url.pathname.slice(base.length).split("/").filter(Boolean).join("/") || "index";
  return `${url.origin}${base}/page-data/${path}/page-data.json`;
}
