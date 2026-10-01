import { db } from "@/lib/db";
import { getExcerpt } from "@/utils/getExcerpt";
import type { GlobalFeedItem } from "./feed.service";

export async function getBlogFeed(): Promise<GlobalFeedItem[]> {
  const posts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  const normalizedPosts: GlobalFeedItem[] = posts.map((post) => ({
    id: post.id,
    type: "blog",
    title: post.title,
    excerpt: getExcerpt(post.content),
    badge: undefined,
    createdAt: post.createdAt,
    heroImage: post.heroImage,
    slug: post.slug,
  }));

  return normalizedPosts;
}

export async function getPostBySlug(slug: string) {
  return db.post.findUnique({ where: { slug } });
}
