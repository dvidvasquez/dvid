import { db } from "@/lib/db";
import { getCoverImage } from "@/utils/getCoverImage";
import { getExcerpt } from "@/utils/getExcerpt";

export type FeedType = "blog" | "travel" | "project";

export type GlobalFeedItem = {
  id: string;
  type: FeedType;
  title: string;
  excerpt: string;
  badge?: string;
  createdAt: Date;
  heroImage: string;
  slug?: string;
};

export async function getGlobalFeed(): Promise<GlobalFeedItem[]> {
  const [posts, trips, projects] = await Promise.all([
    db.post.findMany({
      orderBy: { createdAt: "desc" },
    }),
    db.trip.findMany({
      orderBy: { createdAt: "desc" },
    }),
    db.project.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const normalizedPosts: GlobalFeedItem[] = posts.map((post) => ({
    id: post.id,
    type: "blog",
    title: post.title,
    excerpt: getExcerpt(post.content),
    badge: "BLOG",
    createdAt: post.createdAt,
    heroImage: getCoverImage(post.heroImage, "blog"),
    slug: post.slug,
  }));

  const normalizedTrips: GlobalFeedItem[] = trips.map((trip) => ({
    id: trip.id,
    type: "travel",
    title: `Explorando ${trip.destination}`,
    excerpt: getExcerpt(trip.description),
    badge: "VIAJE",
    createdAt: trip.createdAt,
    heroImage: getCoverImage(trip.heroImage, "travel"),
  }));

  const normalizedProjects: GlobalFeedItem[] = projects.map((project) => ({
    id: project.id,
    type: "project",
    title: project.title,
    excerpt: getExcerpt(project.description),
    badge: "PROYECTO",
    createdAt: project.createdAt,
    heroImage: getCoverImage(project.heroImage, "project"),
  }));

  return [...normalizedPosts, ...normalizedTrips, ...normalizedProjects].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
}
