import type { FeedType } from "@/types/feed";

const DEFAULT_COVERS: Record<FeedType, string> = {
  blog: "/defaults/blog.svg",
  travel: "/defaults/travel.svg",
  project: "/defaults/project.svg",
  news: "/defaults/news.svg",
};

export function getDefaultCover(type: FeedType): string {
  return DEFAULT_COVERS[type];
}

export function getCoverImage(src: string | null | undefined, type: FeedType): string {
  const trimmed = src?.trim();
  return trimmed ? trimmed : getDefaultCover(type);
}
