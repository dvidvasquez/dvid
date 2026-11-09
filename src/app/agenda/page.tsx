import type { Metadata } from "next";
import { AgendaBoard } from "@/components/commons/AgendaBoard";
import { SectionHeader } from "@/components/commons/SectionHeader";
import { getEventsFeed } from "@/services/events.service";
import styles from "../page.module.scss";

// Debe ser un literal: igual a EVENTS_REVALIDATE_SECONDS (3 horas).
export const revalidate = 10800;
export const maxDuration = 60;

export const metadata: Metadata = {
  title: "Agenda · Mi Cuartel Digital",
};

export default async function AgendaPage() {
  const { events, statuses, generatedAt } = await getEventsFeed();
  const working = statuses.filter(({ status }) => status === "ok");

  return (
    <main className={styles.main}>
      <div className={styles.feedShell}>
        <SectionHeader title="Agenda" />
        {events.length > 0 ? (
          <AgendaBoard events={events} generatedAt={generatedAt} />
        ) : (
          <p className={styles.notice}>No se pudieron traer eventos ahora. Se vuelve a intentar solo en unas horas.</p>
        )}
        <p className={styles.footnote}>
          {working.length > 0
            ? `Fuentes: ${working.map(({ source }) => source.nombre).join(", ")}. Se actualiza cada 3 horas.`
            : "Ninguna fuente respondió."}
        </p>
      </div>
    </main>
  );
}
