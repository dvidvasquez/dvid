export type WebcamMarkerClasses = { pill: string; selected: string };

const CAMERA_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8.5A1.5 1.5 0 0 1 5.5 7H8l1.2-2h5.6L16 7h2.5A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z"/><circle cx="12" cy="13" r="3.4"/></svg>';

/** Circulo con una camara dentro; la camara elegida se invierte de color. */
export function buildWebcamMarkerHtml(selected: boolean, classes: WebcamMarkerClasses): string {
  const className = selected ? `${classes.pill} ${classes.selected}` : classes.pill;
  return `<span class="${className}">${CAMERA_SVG}</span>`;
}
