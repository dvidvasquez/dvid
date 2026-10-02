import type { GlobalFeedItem } from "@/types/feed";

export function getFeedItemHref(item: Pick<GlobalFeedItem, "type" | "id" | "slug" | "url">): string {
  switch (item.type) {
    case "blog":
      return `/blog/${item.slug ?? item.id}`;
    case "travel":
      return `/travels/${item.id}`;
    case "project":
      return `/projects/${item.id}`;
    case "news":
      return item.url ?? "/";
  }
}
