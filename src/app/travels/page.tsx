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
        <SectionHeader eyebrow="03 · Bitácora" title="Viajes" subtitle="Relatos y experiencias de mis aventuras por el mundo" />
        <FeedList items={travelFeed} layout="grid" />
      </div>
    </main>
  );
}
