import { db } from "@/lib/db";
import { getCoverImage } from "@/utils/getCoverImage";
import { getExcerpt } from "@/utils/getExcerpt";
import type { GlobalFeedItem } from "@/types/feed";

export async function getTravelFeed(): Promise<GlobalFeedItem[]> {
  const trips = await db.trip.findMany({
    orderBy: { createdAt: "desc" },
  });

  const normalizedTrips: GlobalFeedItem[] = trips.map((trip) => ({
    id: trip.id,
    type: "travel",
    title: `Explorando ${trip.destination}`,
    excerpt: getExcerpt(trip.description),
    badge: undefined,
    createdAt: trip.createdAt,
    heroImage: getCoverImage(trip.heroImage, "travel"),
  }));

  return normalizedTrips;
}

export async function getTripById(id: string) {
  const trip = await db.trip.findUnique({ where: { id } });
  return trip ? { ...trip, heroImage: getCoverImage(trip.heroImage, "travel") } : null;
}
