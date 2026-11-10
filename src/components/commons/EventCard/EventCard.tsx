import { CoverImage } from "@/components/commons/CoverImage";
import { IconButton } from "@/components/commons/IconButton";
import { EVENT_CATEGORIES, EVENT_DEFAULT_COVER } from "@/constants/events";
import type { AgendaEvent, EventOccurrence } from "@/types/event";
import { formatEventPrice } from "@/utils/formatEventPrice";
import { formatEventTime } from "@/utils/formatEventTime";
import { getEventCover } from "@/utils/getEventCover";
import styles from "./EventCard.module.scss";

const CATEGORY_LABELS = new Map(EVENT_CATEGORIES.map(({ id, label }) => [id, label]));
const MEDIA_SIZES = "(min-width: 48rem) 9rem, 6.5rem";

type EventCardProps = {
  occurrence: EventOccurrence;
  saved: boolean;
  onToggleSaved: (event: AgendaEvent) => void;
};

export function EventCard({ occurrence, saved, onToggleSaved }: EventCardProps) {
  const { event, dayNumber, dayCount } = occurrence;
  const price = formatEventPrice(event.price);
  const place = [event.venue, event.municipality].filter(Boolean).join(" · ");

  return (
    <div className={styles.wrap} data-saved={saved}>
      {/* El boton va fuera del enlace: un boton dentro de un <a> no es HTML valido. */}
      <IconButton
        label={saved ? `Quitar de guardados: ${event.title}` : `Guardar: ${event.title}`}
        size="sm"
        className={styles.save}
        aria-pressed={saved}
        onClick={() => onToggleSaved(event)}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill={saved ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        >
          <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1z" />
        </svg>
      </IconButton>
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
    </div>
  );
}
