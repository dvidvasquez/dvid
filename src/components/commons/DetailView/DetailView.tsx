import Image from "next/image";
import { ImageGallery } from "@/components/commons/ImageGallery";
import { TagList } from "@/components/commons/TagList";
import styles from "./DetailView.module.scss";

type DetailViewProps = {
  title: string;
  meta: string;
  heroImage: string;
  description: string;
  tags?: string[];
  images?: string[];
};

export function DetailView({ title, meta, heroImage, description, tags, images }: DetailViewProps) {
  return (
    <article className={styles.detail}>
      <div className={styles.heroWrapper}>
        <Image src={heroImage} alt={title} fill priority sizes="(min-width: 64rem) 40rem, 100vw" className={styles.hero} />
      </div>
      <div className={styles.panel}>
        <header className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <span className={styles.divider} aria-hidden="true" />
          <p className={styles.meta}>{meta}</p>
        </header>
        {tags && tags.length > 0 && <TagList items={tags} />}
        <p className={styles.description}>{description}</p>
        {images && images.length > 0 && <ImageGallery images={images} alt={title} />}
      </div>
    </article>
  );
}
