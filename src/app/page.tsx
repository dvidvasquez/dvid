import { FeedList } from "@/components/commons/FeedList";
import { HeroBanner } from "@/components/commons/HeroBanner";
import { getGlobalFeed } from "@/services/feed.service";
import styles from "./page.module.scss";

export const revalidate = 60;

export default async function Home() {
  const feed = await getGlobalFeed();

  return (
    <>
      <HeroBanner title="Dvid" />
      <main className={styles.main}>
        <div className={styles.feedShell}>
          <FeedList items={feed} />
        </div>
      </main>
    </>
  );
}
