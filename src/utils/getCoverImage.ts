import type { FeedType } from "@/services/feed.service";

const DEFAULT_COVERS: Record<FeedType, string> = {
  blog: "/defaults/blog.svg",
  travel: "/defaults/travel.svg",
  project: "/defaults/project.svg",
};

export function getDefaultCover(type: FeedType): string {
  return DEFAULT_COVERS[type];
}

export function getCoverImage(src: string | null | undefined, type: FeedType): string {
  const trimmed = src?.trim();
  return trimmed ? trimmed : getDefaultCover(type);
}
