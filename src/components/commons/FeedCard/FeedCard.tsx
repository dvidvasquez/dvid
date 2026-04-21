import type { GlobalFeedItem } from "@/services/feed.service";
import { getRelativeTimeLabel } from "@/utils/getRelativeTimeLabel";
import styles from "./FeedCard.module.scss";

type FeedCardProps = {
  item: GlobalFeedItem;
};

export function FeedCard({ item }: FeedCardProps) {
  return (
    <article className={styles.card}>
      <span className={styles.badge}>{item.badge}</span>
      <p className={styles.meta}>{getRelativeTimeLabel(item.createdAt)}</p>
      <h2 className={styles.title}>{item.title}</h2>
      <p className={styles.excerpt}>{item.excerpt}</p>
      <p className={styles.action}>Leer mas -&gt;</p>
    </article>
  );
}
