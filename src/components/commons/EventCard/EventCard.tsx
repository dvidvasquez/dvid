import { CoverImage } from "@/components/commons/CoverImage";
import { EVENT_CATEGORIES, EVENT_DEFAULT_COVER } from "@/constants/events";
import type { EventOccurrence } from "@/types/event";
import { formatEventPrice } from "@/utils/formatEventPrice";
import { formatEventTime } from "@/utils/formatEventTime";
import { getEventCover } from "@/utils/getEventCover";
import styles from "./EventCard.module.scss";

const CATEGORY_LABELS = new Map(EVENT_CATEGORIES.map(({ id, label }) => [id, label]));
const MEDIA_SIZES = "(min-width: 48rem) 9rem, 6.5rem";

type EventCardProps = {
  occurrence: EventOccurrence;
};

export function EventCard({ occurrence }: EventCardProps) {
  const { event, dayNumber, dayCount } = occurrence;
  const price = formatEventPrice(event.price);
  const place = [event.venue, event.municipality].filter(Boolean).join(" · ");

  return (
    <a href={event.url} className={styles.link} target="_blank" rel="noopener noreferrer">
      <article className={styles.card}>
        <div className={styles.media}>
          <CoverImage
            src={getEventCover(event.image)}
            fallbackSrc={EVENT_DEFAULT_COVER}
            alt=""
            fill
            sizes={MEDIA_SIZES}
            unoptimized
            referrerPolicy="no-referrer"
            className={styles.image}
          />
        </div>
        <div className={styles.body}>
          <div className={styles.top}>
            <p className={styles.time}>{formatEventTime(event)}</p>
            {dayCount > 1 && (
              <span className={styles.badge}>
                Día {dayNumber} de {dayCount}
              </span>
            )}
          </div>
          <h3 className={styles.title}>{event.title}</h3>
          {place && <p className={styles.place}>{place}</p>}
          <ul className={styles.meta}>
            <li className={styles.category} data-category={event.category}>
              {CATEGORY_LABELS.get(event.category)}
            </li>
            {price && <li className={event.price === 0 ? styles.free : undefined}>{price}</li>}
            <li>{event.source}</li>
          </ul>
          <p className={styles.action}>Ver evento ↗</p>
        </div>
      </article>
    </a>
  );
}
