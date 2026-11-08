"use client";

import type { KeyboardEvent, PointerEvent, ReactNode } from "react";
import { CHART_MARGIN, CHART_MIN_WIDTH } from "@/constants/chart";
import { useElementWidth } from "@/hooks/useElementWidth";
import { getChartIndex } from "@/utils/getChartIndex";
import { getChartX } from "@/utils/getChartX";
import { ChartTooltip, type ChartTooltipRow } from "../ChartTooltip";
import styles from "./ChartFrame.module.scss";

type ChartFrameProps = {
  height: number;
  /** Descripcion para lectores de pantalla. */
  label: string;
  /** Cantidad de puntos (horas). */
  count: number;
  activeIndex: number | null;
  onActiveChange: (index: number | null) => void;
  tooltip: { title: string; rows: ChartTooltipRow[] } | null;
  /** Contenido del `<svg>` segun el ancho medido. */
  children: (width: number) => ReactNode;
};

/**
 * Contenedor comun de las graficas: mide su ancho, dibuja la linea vertical del punto activo
 * y maneja puntero, foco y teclado (flechas y Escape) para recorrer las horas.
 */
export function ChartFrame({ height, label, count, activeIndex, onActiveChange, tooltip, children }: ChartFrameProps) {
  const [hostRef, hostWidth] = useElementWidth<HTMLDivElement>();
  const width = Math.max(hostWidth, CHART_MIN_WIDTH);

  function indexFromPointer(event: PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return getChartIndex((event.clientX - rect.left) * (width / rect.width), width, count);
  }

  function onKeyDown(event: KeyboardEvent<SVGSVGElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      onActiveChange(Math.min(count - 1, (activeIndex ?? -1) + 1));
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      onActiveChange(Math.max(0, (activeIndex ?? 1) - 1));
    } else if (event.key === "Escape") {
      onActiveChange(null);
    }
  }

  return (
    <div ref={hostRef} className={styles.host} style={{ minHeight: height }}>
      {hostWidth > 0 ? (
        <svg
          className={styles.svg}
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          role="img"
          tabIndex={0}
          aria-label={label}
          onPointerMove={(event) => onActiveChange(indexFromPointer(event))}
          onPointerDown={(event) => onActiveChange(indexFromPointer(event))}
          onPointerLeave={() => onActiveChange(null)}
          onBlur={() => onActiveChange(null)}
          onFocus={() => {
            if (activeIndex === null) onActiveChange(0);
          }}
          onKeyDown={onKeyDown}
        >
          {children(width)}
          {activeIndex !== null ? (
            <line
              className={styles.crosshair}
              x1={getChartX(activeIndex, width, count)}
              x2={getChartX(activeIndex, width, count)}
              y1={CHART_MARGIN.top}
              y2={height - CHART_MARGIN.bottom}
            />
          ) : null}
        </svg>
      ) : null}
      {tooltip && activeIndex !== null && hostWidth > 0 ? (
        <ChartTooltip
          x={getChartX(activeIndex, width, count)}
          hostWidth={hostWidth}
          title={tooltip.title}
          rows={tooltip.rows}
        />
      ) : null}
    </div>
  );
}
