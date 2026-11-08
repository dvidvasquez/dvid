"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ActionButton } from "../ActionButton";
import { IconButton } from "../IconButton";
import styles from "./WebcamViewer.module.scss";

type WebcamViewerProps = {
  title: string;
  src: string;
  subtitle: string;
  forecastLine: string | null;
  pageUrl: string | null;
  onClose: () => void;
};

/**
 * Foto de la camara a pantalla completa. Nunca se agranda por encima de su tamano original
 * (lo exigen los terminos de Windy). El foco queda dentro hasta cerrar y luego vuelve a su sitio.
 */
export function WebcamViewer({ title, src, subtitle, forecastLine, pageUrl, onClose }: WebcamViewerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    return () => previous?.focus();
  }, []);

  function trapTab(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab" || !rootRef.current) return;
    const focusable = Array.from(rootRef.current.querySelectorAll<HTMLElement>("button:not(:disabled), a[href]"));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div ref={rootRef} className={styles.viewer} role="dialog" aria-modal="true" aria-label="Foto de la cámara" onKeyDown={trapTab}>
      <div className={styles.head}>
        <IconButton ref={closeRef} size="sm" tone="overlay" label="Cerrar foto" onClick={onClose}>
          <XMarkIcon aria-hidden="true" />
        </IconButton>
        <div className={styles.titles}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
      </div>
      <div
        className={styles.stage}
        onClick={(event) => {
          // Tocar el fondo negro (fuera de la foto) tambien cierra.
          if (event.target === event.currentTarget) onClose();
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- fotos externas que caducan: no pasan por el optimizador */}
        <img src={src} alt={`Foto reciente de la cámara ${title}`} referrerPolicy="no-referrer" />
      </div>
      <div className={styles.foot}>
        {forecastLine ? <p>{forecastLine}</p> : null}
        {pageUrl ? (
          <ActionButton href={pageUrl} className={styles.link}>
            Ver en Windy ↗
          </ActionButton>
        ) : null}
      </div>
    </div>
  );
}
