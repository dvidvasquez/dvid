import type { GlobalFeedItem } from "@/services/feed.service";
import { FeedCard } from "../FeedCard";
import styles from "./FeedList.module.scss";

type FeedListProps = {
  items: GlobalFeedItem[];
  layout?: "list" | "grid";
};

export function FeedList({ items, layout = "list" }: FeedListProps) {
  const isGrid = layout === "grid";

  return (
    <section className={isGrid ? styles.grid : styles.list}>
      {items.map((item) => (
        <FeedCard key={`${item.type}-${item.id}`} item={item} variant={isGrid ? "tile" : "featured"} />
      ))}
    </section>
  );
}
