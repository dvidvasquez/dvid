import type { GlobalFeedItem } from "@/services/feed.service";

export function getFeedItemHref(item: Pick<GlobalFeedItem, "type" | "id" | "slug">): string {
  switch (item.type) {
    case "blog":
      return `/blog/${item.slug ?? item.id}`;
    case "travel":
      return `/travels/${item.id}`;
    case "project":
      return `/projects/${item.id}`;
  }
}
