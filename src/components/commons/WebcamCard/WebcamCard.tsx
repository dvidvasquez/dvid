"use client";

import { useEffect, useRef } from "react";
import { ArrowsPointingOutIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { Webcam } from "@/types/webcam";
import { getPhotoAgeLabel } from "@/utils/getPhotoAgeLabel";
import { getWebcamPhotoUrl } from "@/utils/getWebcamPhotoUrl";
import { toSafeHttpsUrl } from "@/utils/toSafeHttpsUrl";
import { ActionButton } from "../ActionButton";
import { IconButton } from "../IconButton";
import styles from "./WebcamCard.module.scss";

type WebcamCardProps = {
  cam: Webcam;
  now: number;
  /** Pronostico de la zona mas cercana, para comparar con la foto. */
  forecastLine: string | null;
  imageFailed: boolean;
  onClose: () => void;
  onOpenViewer: () => void;
  onImageError: () => void;
};

/** Tarjeta de la camara elegida: foto reciente, antiguedad, comparacion con el pronostico y enlaces a Windy. */
export function WebcamCard({ cam, now, forecastLine, imageFailed, onClose, onOpenViewer, onImageError }: WebcamCardProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const photo = getWebcamPhotoUrl(cam);
  const pageUrl = toSafeHttpsUrl(cam.pageUrl);
  const liveUrl = toSafeHttpsUrl(cam.liveUrl);
  const dayUrl = toSafeHttpsUrl(cam.dayUrl);

  // Cada vez que se elige otra camara, el foco pasa a la tarjeta para quien navega con teclado.
  useEffect(() => {
    closeRef.current?.focus();
  }, [cam.id]);

  return (
    <section className={styles.card} aria-label="Cámara seleccionada">
      <div className={styles.head}>
        <h2 className={styles.title}>{cam.title}</h2>
        <IconButton ref={closeRef} size="sm" label="Cerrar cámara" onClick={onClose}>
          <XMarkIcon aria-hidden="true" />
        </IconButton>
      </div>
      <button
        type="button"
        className={styles.shot}
        aria-label="Ver la foto en pantalla completa"
        disabled={!photo}
        onClick={onOpenViewer}
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element -- fotos externas que caducan: no pasan por el optimizador
          <img
            src={photo}
            alt={`Foto reciente de la cámara ${cam.title}`}
            width={400}
            height={224}
            referrerPolicy="no-referrer"
            onError={onImageError}
          />
        ) : null}
        <span className={styles.zoom} aria-hidden="true">
          <ArrowsPointingOutIcon />
        </span>
      </button>
      <p className={styles.meta}>{imageFailed ? "No se pudo cargar la foto. Ábrela en Windy." : getPhotoAgeLabel(cam.updatedAt, now)}</p>
      {forecastLine ? <p className={styles.forecast}>{forecastLine}</p> : null}
      <div className={styles.actions}>
        {liveUrl ? (
          <ActionButton href={liveUrl} className={styles.actionBtn}>
            En vivo ↗
          </ActionButton>
        ) : null}
        {dayUrl ? (
          <ActionButton href={dayUrl} className={styles.actionBtn}>
            Timelapse ↗
          </ActionButton>
        ) : null}
        {pageUrl ? (
          <ActionButton href={pageUrl} className={styles.actionBtn}>
            Ver en Windy ↗
          </ActionButton>
        ) : null}
      </div>
      <p className={styles.credit}>
        Cámaras y fotos:{" "}
        <a href="https://www.windy.com/" target="_blank" rel="noopener noreferrer">
          Windy.com
        </a>
        . Son fotos que se renuevan cada pocos minutos.
      </p>
    </section>
  );
}
