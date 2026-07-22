import { notFound } from "next/navigation";
import { DetailView } from "@/components/commons/DetailView";
import { getTripById } from "@/services/travels.service";
import { getRelativeTimeLabel } from "@/utils/getRelativeTimeLabel";
import styles from "../../page.module.scss";

type TravelPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TravelPage({ params }: TravelPageProps) {
  const { id } = await params;
  const trip = await getTripById(id);

  if (!trip) {
    notFound();
  }

  return (
    <main className={styles.main}>
      <div className={styles.feedShell}>
        <DetailView
          title={`Explorando ${trip.destination}`}
          meta={`${trip.locationName} · ${getRelativeTimeLabel(trip.createdAt)}`}
          heroImage={trip.heroImage}
          description={trip.description}
          images={trip.images as string[]}
        />
      </div>
    </main>
  );
}
