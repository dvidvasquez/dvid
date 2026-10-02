import { db } from "@/lib/db";
import { getCoverImage } from "@/utils/getCoverImage";
import { getExcerpt } from "@/utils/getExcerpt";
import type { GlobalFeedItem } from "@/types/feed";

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
    heroImage: getCoverImage(post.heroImage, "blog"),
    slug: post.slug,
  }));

  return normalizedPosts;
}

export async function getPostBySlug(slug: string) {
  const post = await db.post.findUnique({ where: { slug } });
  return post ? { ...post, heroImage: getCoverImage(post.heroImage, "blog") } : null;
}
