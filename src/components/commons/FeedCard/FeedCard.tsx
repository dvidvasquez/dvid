import Image from "next/image";
import Link from "next/link";
import type { GlobalFeedItem } from "@/services/feed.service";
import { getFeedItemHref } from "@/utils/getFeedItemHref";
import { getRelativeTimeLabel } from "@/utils/getRelativeTimeLabel";
import styles from "./FeedCard.module.scss";

export type FeedCardVariant = "featured" | "tile";

type FeedCardProps = {
  item: GlobalFeedItem;
  variant?: FeedCardVariant;
};

export function FeedCard({ item, variant = "featured" }: FeedCardProps) {
  const isTile = variant === "tile";

  return (
    <Link href={getFeedItemHref(item)} className={styles.cardLink}>
      <article className={`${styles.card} ${isTile ? styles.tile : styles.featured}`}>
        <div className={styles.media}>
          <Image
            src={item.heroImage}
            alt=""
            fill
            sizes={isTile ? "(max-width: 28rem) 50vw, 14rem" : "(max-width: 28rem) 100vw, 28rem"}
            className={styles.image}
          />
          {item.badge && <span className={styles.badge}>{item.badge}</span>}
        </div>
        <div className={styles.body}>
          <p className={styles.meta}>{getRelativeTimeLabel(item.createdAt)}</p>
          <h2 className={styles.title}>{item.title}</h2>
          {!isTile && (
            <>
              <p className={styles.excerpt}>{item.excerpt}</p>
              <p className={styles.action}>Leer más →</p>
            </>
          )}
        </div>
      </article>
    </Link>
  );
}
