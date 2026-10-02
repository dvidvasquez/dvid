export type FeedType = "blog" | "travel" | "project" | "news";

export type GlobalFeedItem = {
  id: string;
  type: FeedType;
  title: string;
  excerpt: string;
  badge?: string;
  createdAt: Date | null;
  heroImage: string;
  slug?: string;
  /** URL externa (noticias): la tarjeta abre el sitio original en otra pestaña. */
  url?: string;
  /** Idioma del contenido cuando difiere del sitio (p. ej. "en"). */
  lang?: string;
};
