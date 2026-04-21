import { db } from "@/lib/db";

export type FeedType = "blog" | "travel" | "project";

export type GlobalFeedItem = {
  id: string;
  type: FeedType;
  title: string;
  excerpt: string;
  badge: string;
  createdAt: Date;
  heroImage: string;
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
    excerpt: post.content,
    badge: "BLOG",
    createdAt: post.createdAt,
    heroImage: post.heroImage,
  }));

  const normalizedTrips: GlobalFeedItem[] = trips.map((trip) => ({
    id: trip.id,
    type: "travel",
    title: `Explorando ${trip.destination}`,
    excerpt: trip.description,
    badge: "VIAJE",
    createdAt: trip.createdAt,
    heroImage: trip.heroImage,
  }));

  const normalizedProjects: GlobalFeedItem[] = projects.map((project) => ({
    id: project.id,
    type: "project",
    title: project.title,
    excerpt: project.description,
    badge: "PROYECTO",
    createdAt: project.createdAt,
    heroImage: project.heroImage,
  }));

  return [...normalizedPosts, ...normalizedTrips, ...normalizedProjects].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
}
