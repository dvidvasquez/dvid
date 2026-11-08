import type { Place } from "@/types/weather";

/** Zonas del Valle de Aburra que se muestran en el mapa. La primera es la que se abre por defecto. */
export const CLIMA_PLACES: readonly Place[] = [
  { id: "medellin", name: "Medellín centro", lat: 6.2442, lon: -75.5812 },
  { id: "poblado", name: "El Poblado", lat: 6.2086, lon: -75.5659 },
  { id: "laureles", name: "Laureles", lat: 6.2476, lon: -75.5909 },
  { id: "robledo", name: "Robledo", lat: 6.2793, lon: -75.5959 },
  { id: "sancristobal", name: "San Cristóbal", lat: 6.278, lon: -75.637 },
  { id: "santaelena", name: "Santa Elena", lat: 6.2167, lon: -75.5 },
  { id: "prado", name: "San Antonio de Prado", lat: 6.1861, lon: -75.6586 },
  { id: "bello", name: "Bello", lat: 6.3373, lon: -75.5579 },
  { id: "copacabana", name: "Copacabana", lat: 6.3463, lon: -75.5088 },
  { id: "girardota", name: "Girardota", lat: 6.377, lon: -75.4457 },
  { id: "barbosa", name: "Barbosa", lat: 6.4382, lon: -75.3311 },
  { id: "itagui", name: "Itagüí", lat: 6.1846, lon: -75.5991 },
  { id: "envigado", name: "Envigado", lat: 6.1759, lon: -75.5917 },
  { id: "sabaneta", name: "Sabaneta", lat: 6.1515, lon: -75.6166 },
  { id: "laestrella", name: "La Estrella", lat: 6.1573, lon: -75.6433 },
  { id: "caldas", name: "Caldas", lat: 6.0911, lon: -75.6358 },
];

export const DEFAULT_PLACE: Place = CLIMA_PLACES[0];

export const CLIMA_TIMEZONE = "America/Bogota";

/** Colombia no usa horario de verano: Bogota es UTC-5 todo el ano. */
export const CLIMA_UTC_OFFSET_HOURS = -5;
