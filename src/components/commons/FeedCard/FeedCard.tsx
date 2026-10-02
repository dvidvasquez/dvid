import Link from "next/link";
import { CoverImage } from "@/components/commons/CoverImage";
import type { GlobalFeedItem } from "@/types/feed";
import { getDefaultCover } from "@/utils/getCoverImage";
import { getFeedItemHref } from "@/utils/getFeedItemHref";
import { getRelativeTimeLabel } from "@/utils/getRelativeTimeLabel";
import styles from "./FeedCard.module.scss";

export type FeedCardVariant = "featured" | "tile";

const FEATURED_SIZES = "(min-width: 72rem) 24rem, (min-width: 48rem) 50vw, 100vw";
const TILE_SIZES = "(min-width: 72rem) 18rem, (min-width: 48rem) 33vw, 50vw";

type FeedCardProps = {
  item: GlobalFeedItem;
  variant?: FeedCardVariant;
  headingLevel?: "h2" | "h3";
};

export function FeedCard({ item, variant = "featured", headingLevel = "h2" }: FeedCardProps) {
  const isTile = variant === "tile";
  const isExternal = Boolean(item.url);
  const Heading = headingLevel;

  const content = (
    <article className={`${styles.card} ${isTile ? styles.tile : styles.featured}`} lang={item.lang}>
      <div className={styles.media}>
        <CoverImage
          src={item.heroImage}
          fallbackSrc={getDefaultCover(item.type)}
          alt=""
          fill
          sizes={isTile ? TILE_SIZES : FEATURED_SIZES}
          unoptimized={isExternal}
          referrerPolicy={isExternal ? "no-referrer" : undefined}
          className={styles.image}
        />
        {item.badge && <span className={styles.badge}>{item.badge}</span>}
      </div>
      <div className={styles.body}>
        {item.createdAt && <p className={styles.meta}>{getRelativeTimeLabel(item.createdAt)}</p>}
        <Heading className={styles.title}>{item.title}</Heading>
        {!isTile && (
          <>
            {item.excerpt && <p className={styles.excerpt}>{item.excerpt}</p>}
            <p className={styles.action}>{isExternal ? "Leer en la fuente ↗" : "Leer más →"}</p>
          </>
        )}
      </div>
    </article>
  );

  if (isExternal) {
    return (
      <a href={getFeedItemHref(item)} className={styles.cardLink} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link href={getFeedItemHref(item)} className={styles.cardLink}>
      {content}
    </Link>
  );
}
