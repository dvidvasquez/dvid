import { FeedList } from "@/components/commons/FeedList";
import { HeroBanner } from "@/components/commons/HeroBanner";
import { getGlobalFeed } from "@/services/feed.service";
import styles from "./page.module.scss";

export const revalidate = 60;

export default async function Home() {
  const feed = await getGlobalFeed();

  return (
    <main className={styles.main}>
      <div className={styles.feedShell}>
        <HeroBanner title="Mi Cuartel Digital" />
        <FeedList items={feed} />
      </div>
    </main>
  );
}
