import { db } from "@/lib/db";
import { getExcerpt } from "@/utils/getExcerpt";
import type { GlobalFeedItem } from "./feed.service";

export async function getProjectFeed(): Promise<GlobalFeedItem[]> {
  const projects = await db.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  const normalizedProjects: GlobalFeedItem[] = projects.map((project) => ({
    id: project.id,
    type: "project",
    title: project.title,
    excerpt: getExcerpt(project.description),
    badge: undefined,
    createdAt: project.createdAt,
    heroImage: project.heroImage,
  }));

  return normalizedProjects;
}

export async function getProjectById(id: string) {
  return db.project.findUnique({ where: { id } });
}