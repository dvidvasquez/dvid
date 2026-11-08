import { escapeHtml } from "./escapeHtml";

export type PlaceMarkerClasses = { pill: string; selected: string; wet: string; label: string };

export type PlaceMarkerInput = {
  name: string;
  temperature: number | null;
  wet: boolean;
  selected: boolean;
};

/** Burbuja de temperatura de una zona. La seleccionada muestra tambien su nombre. */
export function buildPlaceMarkerHtml(input: PlaceMarkerInput, classes: PlaceMarkerClasses): string {
  const className = [classes.pill, input.selected ? classes.selected : "", input.wet ? classes.wet : ""]
    .filter(Boolean)
    .join(" ");
  const temperature = input.temperature === null ? "–" : `${input.temperature}°`;
  const label = input.selected ? `<em class="${classes.label}">${escapeHtml(input.name)}</em>` : "";
  return `<span class="${className}">${temperature}${label}</span>`;
}
