import { FeedList } from "@/components/commons/FeedList";
import { SectionHeader } from "@/components/commons/SectionHeader";
import { getBlogFeed } from "@/services/blog.service";
import styles from "../page.module.scss";

export const revalidate = 60;

export default async function BlogPage() {
  const blogFeed = await getBlogFeed();

  return (
    <main className={styles.main}>
      <div className={styles.feedShell}>
        <SectionHeader eyebrow="02 · Escritos" title="Blog" subtitle="Artículos y reflexiones sobre desarrollo y tecnología" />
        <FeedList items={blogFeed} layout="grid" />
      </div>
    </main>
  );
}
