import type { GlobalFeedItem } from "@/services/feed.service";
import { FeedCard } from "../FeedCard";
import styles from "./FeedList.module.scss";

type FeedListProps = {
  items: GlobalFeedItem[];
};

export function FeedList({ items }: FeedListProps) {
  return (
    <section className={styles.list}>
      {items.map((item) => (
        <FeedCard key={`${item.type}-${item.id}`} item={item} />
      ))}
    </section>
  );
}
