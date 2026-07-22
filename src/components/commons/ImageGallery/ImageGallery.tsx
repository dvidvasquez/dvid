import Image from "next/image";
import styles from "./ImageGallery.module.scss";

type ImageGalleryProps = {
  images: string[];
  alt: string;
};

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  return (
    <div className={styles.gallery}>
      {images.map((src) => (
        <div key={src} className={styles.item}>
          <Image src={src} alt={alt} fill className={styles.image} />
        </div>
      ))}
    </div>
  );
}
