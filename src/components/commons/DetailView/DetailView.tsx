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
        <Image src={heroImage} alt={title} fill className={styles.hero} />
      </div>
      <p className={styles.meta}>{meta}</p>
      <h1 className={styles.title}>{title}</h1>
      {tags && tags.length > 0 && <TagList items={tags} />}
      <p className={styles.description}>{description}</p>
      {images && images.length > 0 && <ImageGallery images={images} alt={title} />}
    </article>
  );
}
