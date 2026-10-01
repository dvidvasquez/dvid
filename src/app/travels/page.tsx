import { FeedList } from "@/components/commons/FeedList";
import { SectionHeader } from "@/components/commons/SectionHeader";
import styles from "../page.module.scss";
import { getTravelFeed } from "@/services/travels.service";

export const revalidate = 60;

export default async function TravelsPage() {
  const travelFeed = await getTravelFeed();

  return (
    <main className={styles.main}>
      <div className={styles.feedShell}>
        <SectionHeader title="Viajes" />
        <FeedList items={travelFeed} layout="grid" />
      </div>
    </main>
  );
}
