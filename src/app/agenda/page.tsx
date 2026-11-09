import type { Metadata } from "next";
import { AgendaBoard } from "@/components/commons/AgendaBoard";
import { EventSourcesPanel } from "@/components/commons/EventSourcesPanel";
import { SectionHeader } from "@/components/commons/SectionHeader";
import { EVENTS_WINDOW_DAYS } from "@/constants/events";
import { getEventsFeed } from "@/services/events.service";
import { getAgendaEmptyMessage } from "@/utils/getAgendaEmptyMessage";
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
          <p className={styles.notice}>{getAgendaEmptyMessage(statuses, EVENTS_WINDOW_DAYS)}</p>
        )}
        <EventSourcesPanel statuses={statuses} />
        <p className={styles.footnote}>
          {working.length > 0 ? "Se actualiza cada 3 horas." : "Se vuelve a intentar cada 3 horas."}
        </p>
      </div>
    </main>
  );
}
