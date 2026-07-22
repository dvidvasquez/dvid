import { db } from "@/lib/db";
import type { GlobalFeedItem } from "./feed.service";

export async function getBlogFeed(): Promise<GlobalFeedItem[]> {
  const posts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  const normalizedPosts: GlobalFeedItem[] = posts.map((post) => ({
    id: post.id,
    type: "blog",
    title: post.title,
    excerpt: post.content,
    badge: undefined,
    createdAt: post.createdAt,
    heroImage: post.heroImage,
  }));

  return normalizedPosts;
}
