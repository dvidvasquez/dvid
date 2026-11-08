/**
 * Leaflet se carga desde unpkg la primera vez que hace falta el mapa (solo en el navegador).
 * Estos tipos cubren unicamente lo que usa `ClimaMap`; si Leaflet pasa a ser una dependencia
 * de npm (`npm i leaflet @types/leaflet`), este archivo se reemplaza por el paquete.
 */
export type LatLng = [number, number];

export type LeafletEvented = {
  on(event: string, handler: () => void): unknown;
};

export type LeafletIcon = object;

export type LeafletMarker = LeafletEvented & {
  setIcon(icon: LeafletIcon): unknown;
  setZIndexOffset(offset: number): unknown;
  addTo(target: LeafletMap | LeafletLayerGroup): LeafletMarker;
};

export type LeafletTileLayer = {
  addTo(map: LeafletMap): LeafletTileLayer;
  setOpacity(opacity: number): unknown;
};

export type LeafletLayerGroup = {
  addTo(map: LeafletMap): LeafletLayerGroup;
  addLayer(layer: LeafletMarker): unknown;
};

export type LeafletMap = LeafletEvented & {
  createPane(name: string): HTMLElement;
  getPane(name: string): HTMLElement | undefined;
  setView(center: LatLng, zoom: number): unknown;
  fitBounds(bounds: unknown, options: object): unknown;
  panTo(center: LatLng): unknown;
  panInside?(center: LatLng, options: object): unknown;
  removeLayer(layer: unknown): unknown;
  remove(): unknown;
  attributionControl: {
    addAttribution(html: string): unknown;
    removeAttribution(html: string): unknown;
  };
};

export type LeafletNamespace = {
  map(element: HTMLElement, options: object): LeafletMap;
  control: { zoom(options: object): { addTo(map: LeafletMap): unknown } };
  tileLayer(template: string, options: object): LeafletTileLayer;
  marker(center: LatLng, options: object): LeafletMarker;
  divIcon(options: object): LeafletIcon;
  layerGroup(): LeafletLayerGroup;
  latLngBounds(points: LatLng[]): unknown;
};

declare global {
  interface Window {
    L?: LeafletNamespace;
  }
}

const LEAFLET_BASE = "https://unpkg.com/leaflet@1.9.4/dist";

let pending: Promise<LeafletNamespace> | null = null;

function addStylesheetOnce(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

export function loadLeaflet(): Promise<LeafletNamespace> {
  if (typeof window === "undefined") return Promise.reject(new Error("Leaflet solo funciona en el navegador"));
  if (window.L) return Promise.resolve(window.L);
  if (pending) return pending;

  pending = new Promise<LeafletNamespace>((resolve, reject) => {
    addStylesheetOnce(`${LEAFLET_BASE}/leaflet.css`);
    const script = document.createElement("script");
    script.src = `${LEAFLET_BASE}/leaflet.js`;
    script.async = true;
    script.onload = () => {
      if (window.L) resolve(window.L);
      else reject(new Error("Leaflet cargó pero no expuso `L`"));
    };
    script.onerror = () => {
      script.remove();
      reject(new Error("No se pudo descargar Leaflet"));
    };
    document.head.appendChild(script);
  }).catch((error: unknown) => {
    pending = null; // permite reintentar en la siguiente visita
    throw error;
  });
  return pending;
}
