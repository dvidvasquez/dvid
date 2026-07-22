import { db } from "@/lib/db";
import type { GlobalFeedItem } from "./feed.service";

export async function getTravelFeed(): Promise<GlobalFeedItem[]> {
  const trips = await db.trip.findMany({
    orderBy: { createdAt: "desc" },
  });

  const normalizedTrips: GlobalFeedItem[] = trips.map((trip) => ({
    id: trip.id,
    type: "travel",
    title: `Explorando ${trip.destination}`,
    excerpt: trip.description,
    badge: undefined,
    createdAt: trip.createdAt,
    heroImage: trip.heroImage,
  }));

  return normalizedTrips;
}

export async function getTripById(id: string) {
  return db.trip.findUnique({ where: { id } });
}
