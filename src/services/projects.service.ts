import { db } from "@/lib/db";
import type { GlobalFeedItem } from "./feed.service";

export async function getProjectFeed(): Promise<GlobalFeedItem[]> {
  const projects = await db.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  const normalizedProjects: GlobalFeedItem[] = projects.map((project) => ({
    id: project.id,
    type: "project",
    title: project.title,
    excerpt: project.description,
    badge: undefined,
    createdAt: project.createdAt,
    heroImage: project.heroImage,
  }));

  return normalizedProjects;
}