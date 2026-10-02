import {
  NEWS_CATEGORIES,
  NEWS_ITEMS_PER_SOURCE,
  NEWS_SOURCES,
  type NewsCategory,
  type NewsSource,
} from "@/constants/newsSources";
import type { GlobalFeedItem } from "@/types/feed";
import { findFeedLinks } from "@/utils/findFeedLinks";
import { getCoverImage } from "@/utils/getCoverImage";
import { getExcerpt } from "@/utils/getExcerpt";
import { parseFeed, type ParsedFeedItem } from "@/utils/parseFeed";

/** 6 horas. Mantener igual al `revalidate` de las paginas que usan noticias. */
export const NEWS_REVALIDATE_SECONDS = 21600;

const REQUEST_TIMEOUT_MS = 7000;
const MIN_EXCERPT_LENGTH = 30;
const COMMON_FEED_PATHS = ["feed/", "rss", "rss.xml", "feed.xml"];
const USER_AGENT = "Mozilla/5.0 (compatible; DvidNews/1.0; lector RSS personal)";
/** Respuestas que significan "aqui no hay feed", no que la fuente este caida. */
const NOT_FOUND_STATUSES = new Set([404, 410]);

export type NewsSourceStatus = {
  source: NewsSource;
  status: "ok" | "sin-feed" | "error";
  feedUrl: string | null;
  itemCount: number;
  message?: string;
};

export type NewsSection = {
  category: NewsCategory;
  label: string;
  items: GlobalFeedItem[];
};

export type NewsFeed = {
  sections: NewsSection[];
  statuses: NewsSourceStatus[];
};

type FetchResult = { ok: true; text: string } | { ok: false; error: string | null };

async function fetchText(url: string): Promise<FetchResult> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, text/html;q=0.8, */*;q=0.5",
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      next: { revalidate: NEWS_REVALIDATE_SECONDS },
    });
    if (NOT_FOUND_STATUSES.has(response.status)) return { ok: false, error: null };
    if (!response.ok) return { ok: false, error: `HTTP ${response.status}` };
    return { ok: true, text: await response.text() };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.name : "Error de red" };
  }
}

type FeedAttempt = { feedUrl: string; items: ParsedFeedItem[] } | { error: string | null };

async function tryFeed(url: string): Promise<FeedAttempt> {
  const result = await fetchText(url);
  if (!result.ok) return { error: result.error };
  const items = parseFeed(result.text, url);
  return items.length > 0 ? { feedUrl: url, items } : { error: null };
}

function isFound(attempt: FeedAttempt): attempt is { feedUrl: string; items: ParsedFeedItem[] } {
  return "feedUrl" in attempt;
}

async function resolveFeed(source: NewsSource): Promise<FeedAttempt> {
  const tried = new Set<string>();
  let lastError: string | null = null;

  const attempt = async (urls: string[]) => {
    const pending = urls.filter((url) => !tried.has(url));
    pending.forEach((url) => tried.add(url));
    const results = await Promise.all(pending.map(tryFeed));
    for (const result of results) {
      if (isFound(result)) return result;
      if (result.error) lastError = result.error;
    }
    return null;
  };

  if (source.feedUrl) {
    const found = await attempt([source.feedUrl]);
    if (found) return found;
  }

  const base = source.url.endsWith("/") ? source.url : `${source.url}/`;
  const [page, fromCommonPaths] = await Promise.all([
    fetchText(source.url),
    attempt(COMMON_FEED_PATHS.map((path) => new URL(path, base).href)),
  ]);
  if (fromCommonPaths) return fromCommonPaths;

  if (page.ok) {
    const found = await attempt(findFeedLinks(page.text, source.url).slice(0, 3));
    if (found) return found;
  } else if (page.error) {
    lastError = page.error;
  }

  return { error: lastError };
}

function byNewestFirst(a: { publishedAt: Date | null }, b: { publishedAt: Date | null }) {
  return (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0);
}

function toFeedItem(item: ParsedFeedItem, source: NewsSource): GlobalFeedItem {
  const excerpt = getExcerpt(item.excerpt);

  return {
    id: item.link,
    type: "news",
    title: item.title,
    excerpt: excerpt.length >= MIN_EXCERPT_LENGTH ? excerpt : "",
    badge: source.nombre.toUpperCase(),
    createdAt: item.publishedAt,
    heroImage: getCoverImage(item.image, "news"),
    url: item.link,
    lang: source.idioma === "en" ? "en" : undefined,
  };
}

async function loadSource(source: NewsSource): Promise<{ status: NewsSourceStatus; items: GlobalFeedItem[] }> {
  const result = await resolveFeed(source);

  if (!isFound(result)) {
    return {
      status: {
        source,
        status: result.error ? "error" : "sin-feed",
        feedUrl: null,
        itemCount: 0,
        message: result.error ?? undefined,
      },
      items: [],
    };
  }

  const items = [...result.items]
    .sort(byNewestFirst)
    .slice(0, NEWS_ITEMS_PER_SOURCE)
    .map((item) => toFeedItem(item, source));

  return {
    status: { source, status: "ok", feedUrl: result.feedUrl, itemCount: items.length },
    items,
  };
}

/** Ultimas noticias de cada fuente configurada, agrupadas por categoria. */
export async function getNewsFeed(sources: NewsSource[] = NEWS_SOURCES): Promise<NewsFeed> {
  const results = await Promise.all(sources.map(loadSource));
  const seen = new Set<string>();

  const sections = NEWS_CATEGORIES.map(({ id, label }) => {
    const items = results
      .filter(({ status }) => status.source.categoria === id)
      .flatMap(({ items }) => items)
      .filter((item) => (seen.has(item.id) ? false : (seen.add(item.id), true)))
      .sort((a, b) => byNewestFirst({ publishedAt: a.createdAt }, { publishedAt: b.createdAt }));

    return { category: id, label, items };
  }).filter((section) => section.items.length > 0);

  return { sections, statuses: results.map(({ status }) => status) };
}
