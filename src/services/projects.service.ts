import { db } from "@/lib/db";
import { getCoverImage } from "@/utils/getCoverImage";
import { getExcerpt } from "@/utils/getExcerpt";
import type { GlobalFeedItem } from "@/types/feed";

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
    heroImage: getCoverImage(project.heroImage, "project"),
  }));

  return normalizedProjects;
}

export async function getProjectById(id: string) {
  const project = await db.project.findUnique({ where: { id } });
  return project ? { ...project, heroImage: getCoverImage(project.heroImage, "project") } : null;
}