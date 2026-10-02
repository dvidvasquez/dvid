import { FeedList } from "@/components/commons/FeedList";
import type { GlobalFeedItem } from "@/types/feed";
import styles from "./NewsSection.module.scss";

type NewsSectionProps = {
  id: string;
  label: string;
  items: GlobalFeedItem[];
};

export function NewsSection({ id, label, items }: NewsSectionProps) {
  const headingId = `news-${id}`;

  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <header className={styles.header}>
        <h2 id={headingId} className={styles.title}>
          {label}
        </h2>
        <span className={styles.count}>{items.length}</span>
      </header>
      <FeedList items={items} headingLevel="h3" />
    </section>
  );
}
