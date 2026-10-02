import type { Metadata } from "next";
import { SectionHeader } from "@/components/commons/SectionHeader";
import { SourceStatusList } from "@/components/commons/SourceStatusList";
import { NEWS_CATEGORIES } from "@/constants/newsSources";
import { getNewsFeed } from "@/services/news.service";
import styles from "../page.module.scss";

export const revalidate = 21600;
export const maxDuration = 60;

export const metadata: Metadata = {
  title: "Fuentes · Mi Cuartel Digital",
};

export default async function SourcesPage() {
  const { statuses } = await getNewsFeed();
  const working = statuses.filter(({ status }) => status === "ok").length;

  return (
    <main className={styles.main}>
      <div className={styles.feedShell}>
        <SectionHeader title="Fuentes" />
        <p className={styles.footnote}>
          {working} de {statuses.length} fuentes con noticias. Se revisan cada 6 horas.
        </p>
        {NEWS_CATEGORIES.map(({ id, label }) => {
          const group = statuses.filter(({ source }) => source.categoria === id);
          if (group.length === 0) return null;
          return (
            <section key={id} className={styles.group}>
              <h2 className={styles.groupTitle}>{label}</h2>
              <SourceStatusList statuses={group} />
            </section>
          );
        })}
      </div>
    </main>
  );
}
