import type { GlobalFeedItem } from "@/types/feed";
import { FeedCard } from "../FeedCard";
import styles from "./FeedList.module.scss";

type FeedListProps = {
  items: GlobalFeedItem[];
  layout?: "list" | "grid";
  headingLevel?: "h2" | "h3";
};

export function FeedList({ items, layout = "list", headingLevel }: FeedListProps) {
  const isGrid = layout === "grid";

  return (
    <section className={isGrid ? styles.grid : styles.list}>
      {items.map((item) => (
        <FeedCard
          key={`${item.type}-${item.id}`}
          item={item}
          variant={isGrid ? "tile" : "featured"}
          headingLevel={headingLevel}
        />
      ))}
    </section>
  );
}
