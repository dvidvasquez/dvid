import { notFound } from "next/navigation";
import { DetailView } from "@/components/commons/DetailView";
import { getProjectById } from "@/services/projects.service";
import { getDefaultCover } from "@/utils/getCoverImage";
import { getRelativeTimeLabel } from "@/utils/getRelativeTimeLabel";
import { parseTags } from "@/utils/parseTags";
import styles from "../../page.module.scss";

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <main className={styles.main}>
      <div className={styles.feedShell}>
        <DetailView
          title={project.title}
          meta={getRelativeTimeLabel(project.createdAt)}
          heroImage={project.heroImage}
          fallbackImage={getDefaultCover("project")}
          description={project.description}
          tags={parseTags(project.techStack)}
          images={project.images as string[]}
        />
      </div>
    </main>
  );
}
