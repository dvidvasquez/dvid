import { FeedList } from "@/components/commons/FeedList";
import { SectionHeader } from "@/components/commons/SectionHeader";
import styles from "../page.module.scss";
import { getProjectFeed } from "@/services/projects.service";

export const revalidate = 60;

export default async function ProjectsPage() {
  const projectFeed = await getProjectFeed();
  return (
    <main className={styles.main}>
      <div className={styles.feedShell}>
        <SectionHeader eyebrow="04 · Laboratorio" title="Proyectos" subtitle="Mis proyectos personales y colaborativos en desarrollo y tecnología" />
        <FeedList items={projectFeed} layout="grid" />
      </div>
    </main>
  );
}
