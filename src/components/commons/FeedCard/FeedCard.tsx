import Link from "next/link";
import type { GlobalFeedItem } from "@/services/feed.service";
import { getFeedItemHref } from "@/utils/getFeedItemHref";
import { getRelativeTimeLabel } from "@/utils/getRelativeTimeLabel";
import styles from "./FeedCard.module.scss";

type FeedCardProps = {
  item: GlobalFeedItem;
};

export function FeedCard({ item }: FeedCardProps) {
  return (
    <Link href={getFeedItemHref(item)} className={styles.cardLink}>
      <article className={styles.card}>
        {item.badge && <span className={styles.badge}>{item.badge}</span>}
        <p className={styles.meta}>{getRelativeTimeLabel(item.createdAt)}</p>
        <h2 className={styles.title}>{item.title}</h2>
        <p className={styles.excerpt}>{item.excerpt}</p>
        <p className={styles.action}>Leer mas -&gt;</p>
      </article>
    </Link>
  );
}
