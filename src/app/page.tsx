import Link from "next/link";
import { HeroBanner } from "@/components/commons/HeroBanner";
import { NewsSection } from "@/components/commons/NewsSection";
import { getNewsFeed } from "@/services/news.service";
import styles from "./page.module.scss";

// 6 horas (NEWS_REVALIDATE_SECONDS). Debe ser un literal para el analisis estatico de Next.
export const revalidate = 21600;
export const maxDuration = 60;

export default async function Home() {
  const { sections } = await getNewsFeed();

  return (
    <>
      <HeroBanner title="Dvid" />
      <main className={styles.main}>
        <div className={styles.feedShell}>
          {sections.length > 0 ? (
            sections.map((section) => (
              <NewsSection key={section.category} id={section.category} label={section.label} items={section.items} />
            ))
          ) : (
            <p className={styles.notice}>No pudimos cargar noticias en este momento. Vuelve a intentarlo más tarde.</p>
          )}
          <p className={styles.footnote}>
            Se actualiza cada 6 horas · <Link href="/fuentes">Ver fuentes</Link>
          </p>
        </div>
      </main>
    </>
  );
}
