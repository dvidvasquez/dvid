import { notFound } from "next/navigation";
import { DetailView } from "@/components/commons/DetailView";
import { getProjectById } from "@/services/projects.service";
import { getRelativeTimeLabel } from "@/utils/getRelativeTimeLabel";
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
          description={project.description}
          tags={project.techStack.split(",")}
          images={project.images as string[]}
        />
      </div>
    </main>
  );
}
