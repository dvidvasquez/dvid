"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { IconButton } from "../IconButton";
import styles from "./DetailsSheet.module.scss";

type DetailsSheetProps = {
  onClose: () => void;
  children: ReactNode;
};

/**
 * Detalles del clima: hoja inferior en el telefono y panel lateral en escritorio.
 * Al abrir lleva el foco al boton de cerrar y al cerrar lo devuelve a donde estaba.
 */
export function DetailsSheet({ onClose, children }: DetailsSheetProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    return () => previous?.focus();
  }, []);

  return (
    <>
      <div className={styles.scrim} onClick={onClose} aria-hidden="true" />
      <aside className={styles.sheet} role="dialog" aria-label="Detalles del clima">
        <div className={styles.head}>
          <h2 className={styles.title}>Detalles</h2>
          <IconButton ref={closeRef} size="sm" label="Cerrar detalles" onClick={onClose}>
            <XMarkIcon aria-hidden="true" />
          </IconButton>
        </div>
        <div className={styles.scroll}>{children}</div>
      </aside>
    </>
  );
}
