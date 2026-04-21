import { FeedList } from "@/components/commons/FeedList";
import { SectionHeader } from "@/components/commons/SectionHeader";
import { getGlobalFeed } from "@/services/feed.service";
import styles from "./page.module.scss";

export default async function Home() {
  const feed = await getGlobalFeed();

  return (
    <main className={styles.main}>
      <div className={styles.feedShell}>
        <SectionHeader title="Mi Cuartel Digital" subtitle="Feed combinado de blog, viajes y proyectos" />
        <FeedList items={feed} />
      </div>
    </main>
  );
}
