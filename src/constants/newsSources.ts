export type NewsCategory =
  | "tecnologia_ia"
  | "tecnologia_latam"
  | "fintech"
  | "desarrollo"
  | "economia"
  | "politica_colombia"
  | "medellin_antioquia"
  | "geopolitica"
  | "geopolitica_latam"
  | "cultura_medellin"
  | "skate"
  | "surf"
  | "viajes";

export type NewsSource = {
  nombre: string;
  /** Sitio principal: se usa para descubrir el feed si no hay feedUrl o si falla. */
  url: string;
  categoria: NewsCategory;
  idioma: "es" | "en";
  /** Feed RSS/Atom conocido. Opcional: sin el, se busca en la pagina y en rutas comunes. */
  feedUrl?: string;
};

/** Cuantas noticias tomar de cada fuente. */
export const NEWS_ITEMS_PER_SOURCE = 3;

/** En el orden en que se muestran en el inicio. */
export const NEWS_CATEGORIES: { id: NewsCategory; label: string }[] = [
  { id: "tecnologia_ia", label: "Tecnología e IA" },
  { id: "tecnologia_latam", label: "Tecnología LatAm" },
  { id: "fintech", label: "Fintech" },
  { id: "desarrollo", label: "Desarrollo" },
  { id: "economia", label: "Economía" },
  { id: "politica_colombia", label: "Política Colombia" },
  { id: "medellin_antioquia", label: "Medellín y Antioquia" },
  { id: "geopolitica", label: "Geopolítica" },
  { id: "geopolitica_latam", label: "Geopolítica LatAm" },
  { id: "cultura_medellin", label: "Cultura Medellín" },
  { id: "skate", label: "Skate" },
  { id: "surf", label: "Surf" },
  { id: "viajes", label: "Viajes" },
];

export const NEWS_SOURCES: NewsSource[] = [
  { nombre: "Hipertextual", url: "https://hipertextual.com", categoria: "tecnologia_ia", idioma: "es", feedUrl: "https://hipertextual.com/feed" },
  { nombre: "Enter.co", url: "https://www.enter.co", categoria: "tecnologia_ia", idioma: "es", feedUrl: "https://www.enter.co/feed/" },
  { nombre: "Xataka Colombia", url: "https://www.xataka.com.co", categoria: "tecnologia_ia", idioma: "es", feedUrl: "https://www.xataka.com.co/feedburner.xml" },
  { nombre: "Rest of World", url: "https://restofworld.org", categoria: "tecnologia_latam", idioma: "en", feedUrl: "https://restofworld.org/feed/latest" },
  { nombre: "LatamList", url: "https://latamlist.com", categoria: "tecnologia_latam", idioma: "en", feedUrl: "https://latamlist.com/feed/" },
  { nombre: "Colombia Fintech", url: "https://www.colombiafintech.co", categoria: "fintech", idioma: "es" },
  { nombre: "Hacker News", url: "https://news.ycombinator.com", categoria: "desarrollo", idioma: "en", feedUrl: "https://news.ycombinator.com/rss" },
  { nombre: "DEV Community", url: "https://dev.to", categoria: "desarrollo", idioma: "en", feedUrl: "https://dev.to/feed" },
  { nombre: "Azure DevOps Blog", url: "https://devblogs.microsoft.com/devops", categoria: "desarrollo", idioma: "en", feedUrl: "https://devblogs.microsoft.com/devops/feed/" },
  { nombre: "Portafolio", url: "https://www.portafolio.co", categoria: "economia", idioma: "es" },
  { nombre: "La República", url: "https://www.larepublica.co", categoria: "economia", idioma: "es" },
  { nombre: "El Tiempo", url: "https://www.eltiempo.com", categoria: "politica_colombia", idioma: "es" },
  { nombre: "El Colombiano", url: "https://www.elcolombiano.com", categoria: "medellin_antioquia", idioma: "es" },
  { nombre: "BBC Mundo", url: "https://www.bbc.com/mundo", categoria: "geopolitica", idioma: "es", feedUrl: "https://feeds.bbci.co.uk/mundo/rss.xml" },
  { nombre: "Infobae América", url: "https://www.infobae.com/america", categoria: "geopolitica_latam", idioma: "es" },
  { nombre: "Americas Quarterly", url: "https://www.americasquarterly.org", categoria: "geopolitica_latam", idioma: "en", feedUrl: "https://www.americasquarterly.org/feed/" },
  { nombre: "Comfama", url: "https://www.comfama.org", categoria: "cultura_medellin", idioma: "es" },
  { nombre: "Alcaldía de Medellín", url: "https://www.medellin.gov.co", categoria: "cultura_medellin", idioma: "es" },
  { nombre: "Street League Skateboarding", url: "https://streetleague.com", categoria: "skate", idioma: "en" },
  { nombre: "X Games", url: "https://www.xgames.com", categoria: "skate", idioma: "en" },
  { nombre: "Thrasher Magazine", url: "https://www.thrashermagazine.com", categoria: "skate", idioma: "en" },
  { nombre: "World Surf League", url: "https://www.worldsurfleague.com", categoria: "surf", idioma: "en" },
  { nombre: "Surfline", url: "https://www.surfline.com", categoria: "surf", idioma: "en" },
  { nombre: "Lonely Planet", url: "https://www.lonelyplanet.com", categoria: "viajes", idioma: "en" },
  { nombre: "Colombia Travel", url: "https://colombia.travel", categoria: "viajes", idioma: "es" },
];
