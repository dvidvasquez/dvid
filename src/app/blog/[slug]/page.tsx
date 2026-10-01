import { notFound } from "next/navigation";
import { DetailView } from "@/components/commons/DetailView";
import { getPostBySlug } from "@/services/blog.service";
import { getDefaultCover } from "@/utils/getCoverImage";
import { getRelativeTimeLabel } from "@/utils/getRelativeTimeLabel";
import { parseTags } from "@/utils/parseTags";
import styles from "../../page.module.scss";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className={styles.main}>
      <div className={styles.feedShell}>
        <DetailView
          title={post.title}
          meta={getRelativeTimeLabel(post.createdAt)}
          heroImage={post.heroImage}
          fallbackImage={getDefaultCover("blog")}
          description={post.content}
          tags={parseTags(post.tags)}
        />
      </div>
    </main>
  );
}
