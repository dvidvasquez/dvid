"use client";

import { useEffect, useRef, useState } from "react";
import { useLatestRef } from "@/hooks/useLatestRef";
import {
  loadLeaflet,
  type LatLng,
  type LeafletMap,
  type LeafletMarker,
  type LeafletNamespace,
  type LeafletTileLayer,
} from "@/lib/leaflet";
import type { Webcam } from "@/types/webcam";
import type { Place, PlaceSnapshot, PlaceSnapshots, RadarMaps } from "@/types/weather";
import { buildPlaceMarkerHtml } from "@/utils/buildPlaceMarkerHtml";
import { buildRadarTileUrl } from "@/utils/buildRadarTileUrl";
import { buildWebcamMarkerHtml } from "@/utils/buildWebcamMarkerHtml";
import styles from "./ClimaMap.module.scss";

type ClimaMapProps = {
  places: readonly Place[];
  selectedPlaceId: string;
  snapshots: PlaceSnapshots;
  radar: RadarMaps | null;
  radarIndex: number;
  webcams: readonly Webcam[];
  showWebcams: boolean;
  selectedWebcamId: number | null;
  /** En escritorio, el panel de detalles tapa la derecha: se corren los controles del mapa. */
  sheetOpen: boolean;
  onSelectPlace: (id: string) => void;
  onSelectWebcam: (id: number) => void;
};

type MapInstance = { L: LeafletNamespace; map: LeafletMap };

const OSM_TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_ATTRIBUTION = '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>';
const RADAR_ATTRIBUTION = 'Radar © <a href="https://www.rainviewer.com/" target="_blank" rel="noopener">RainViewer</a>';
const WEBCAM_ATTRIBUTION = 'Cámaras © <a href="https://www.windy.com/" target="_blank" rel="noopener">Windy.com</a>';
const RADAR_OPACITY = 0.75;
/** Alto aproximado de la tarjeta de camara + barra del radar + barra de navegacion. */
const WEBCAM_PAN_BOTTOM_PX = 330;

const PLACE_CLASSES = {
  pill: styles.pill,
  selected: styles.pillSelected,
  wet: styles.pillWet,
  label: styles.pillLabel,
};

const WEBCAM_CLASSES = { pill: styles.webcamPill, selected: styles.webcamPillSelected };

function createPlaceIcon(L: LeafletNamespace, place: Place, snapshot: PlaceSnapshot | undefined, selected: boolean) {
  return L.divIcon({
    className: styles.marker,
    iconSize: [0, 0],
    html: buildPlaceMarkerHtml(
      { name: place.name, temperature: snapshot?.temperature ?? null, wet: snapshot?.wet ?? false, selected },
      PLACE_CLASSES,
    ),
  });
}

function createWebcamIcon(L: LeafletNamespace, selected: boolean) {
  return L.divIcon({ className: styles.marker, iconSize: [0, 0], html: buildWebcamMarkerHtml(selected, WEBCAM_CLASSES) });
}

/**
 * Mapa de Leaflet (se descarga la primera vez que se muestra): mapa base de OpenStreetMap, burbujas
 * de temperatura, radar de lluvia y camaras. Leaflet es imperativo, por eso cada capa vive en su efecto.
 */
export function ClimaMap({
  places,
  selectedPlaceId,
  snapshots,
  radar,
  radarIndex,
  webcams,
  showWebcams,
  selectedWebcamId,
  sheetOpen,
  onSelectPlace,
  onSelectWebcam,
}: ClimaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [instance, setInstance] = useState<MapInstance | null>(null);
  const [failed, setFailed] = useState(false);
  const latest = useLatestRef({ places, selectedPlaceId, webcams, selectedWebcamId, onSelectPlace, onSelectWebcam });
  const placeMarkers = useRef(new Map<string, LeafletMarker>());
  const webcamMarkers = useRef(new Map<number, LeafletMarker>());
  const radarLayers = useRef<LeafletTileLayer[]>([]);
  const pannedPlaceId = useRef(selectedPlaceId);

  // Crear el mapa.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;
    let created: LeafletMap | null = null;

    loadLeaflet()
      .then((L) => {
        if (cancelled) return;
        const map = L.map(container, { zoomSnap: 0.5, zoomControl: false });
        created = map;
        L.control.zoom({ position: "topright", zoomInTitle: "Acercar", zoomOutTitle: "Alejar" }).addTo(map);
        // El mapa base va en un panel propio para que el filtro oscuro no altere los colores del radar.
        map.createPane("basemap");
        const pane = map.getPane("basemap");
        if (pane) pane.style.zIndex = "150";
        L.tileLayer(OSM_TILES, { attribution: OSM_ATTRIBUTION, maxZoom: 19, pane: "basemap" }).addTo(map);
        map.attributionControl.addAttribution(RADAR_ATTRIBUTION);

        const { places: all, selectedPlaceId: selectedId } = latest.current;
        const selected = all.find((place) => place.id === selectedId) ?? all[0];
        if (window.innerWidth < 700) {
          map.setView([selected.lat, selected.lon], 11.5);
        } else {
          map.fitBounds(L.latLngBounds(all.map((place): LatLng => [place.lat, place.lon])), {
            paddingTopLeft: [380, 40],
            paddingBottomRight: [40, 190],
            maxZoom: 11.5,
          });
        }
        pannedPlaceId.current = selectedId;
        setInstance({ L, map });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      created?.remove();
    };
  }, [latest]);

  // Burbujas de cada zona.
  useEffect(() => {
    if (!instance) return;
    const { L, map } = instance;
    const markers = placeMarkers.current;
    places.forEach((place) => {
      const marker = L.marker([place.lat, place.lon], {
        icon: createPlaceIcon(L, place, undefined, false),
        title: place.name,
        keyboard: true,
      }).addTo(map);
      marker.on("click", () => latest.current.onSelectPlace(place.id));
      markers.set(place.id, marker);
    });
    return () => {
      markers.forEach((marker) => map.removeLayer(marker));
      markers.clear();
    };
  }, [instance, places, latest]);

  // Temperatura, lluvia y seleccion de cada burbuja.
  useEffect(() => {
    if (!instance) return;
    placeMarkers.current.forEach((marker, id) => {
      const place = places.find((candidate) => candidate.id === id);
      if (!place) return;
      const snapshot: PlaceSnapshot | undefined = snapshots[id];
      const selected = id === selectedPlaceId;
      marker.setIcon(createPlaceIcon(instance.L, place, snapshot, selected));
      marker.setZIndexOffset(selected ? 500 : 0);
    });
  }, [instance, places, snapshots, selectedPlaceId]);

  // Al elegir otra zona, el mapa se centra en ella (no al abrir).
  useEffect(() => {
    if (!instance || pannedPlaceId.current === selectedPlaceId) return;
    pannedPlaceId.current = selectedPlaceId;
    const place = places.find((candidate) => candidate.id === selectedPlaceId);
    if (place) instance.map.panTo([place.lat, place.lon]);
  }, [instance, places, selectedPlaceId]);

  // Capas del radar: una por cuadro, todas invisibles menos la que se muestra.
  useEffect(() => {
    if (!instance || !radar) return;
    const { L, map } = instance;
    const layers = radar.frames.map((frame, i) =>
      L.tileLayer(buildRadarTileUrl(radar.host, frame.path), {
        opacity: 0,
        maxNativeZoom: 7,
        maxZoom: 18,
        zIndex: 5 + i,
        tileSize: 256,
      }).addTo(map),
    );
    radarLayers.current = layers;
    return () => {
      layers.forEach((layer) => map.removeLayer(layer));
      radarLayers.current = [];
    };
  }, [instance, radar]);

  useEffect(() => {
    radarLayers.current.forEach((layer, i) => layer.setOpacity(i === radarIndex ? RADAR_OPACITY : 0));
  }, [instance, radar, radarIndex]);

  // Camaras publicas.
  useEffect(() => {
    if (!instance || !showWebcams) return;
    const { L, map } = instance;
    const markers = webcamMarkers.current;
    const group = L.layerGroup();
    webcams.forEach((cam) => {
      const marker = L.marker([cam.lat, cam.lon], {
        icon: createWebcamIcon(L, cam.id === latest.current.selectedWebcamId),
        title: cam.title,
        keyboard: true,
        zIndexOffset: 300,
      });
      marker.on("click", () => latest.current.onSelectWebcam(cam.id));
      group.addLayer(marker);
      markers.set(cam.id, marker);
    });
    group.addTo(map);
    map.attributionControl.addAttribution(WEBCAM_ATTRIBUTION);
    return () => {
      map.removeLayer(group);
      map.attributionControl.removeAttribution(WEBCAM_ATTRIBUTION);
      markers.clear();
    };
  }, [instance, webcams, showWebcams, latest]);

  useEffect(() => {
    if (!instance) return;
    webcamMarkers.current.forEach((marker, id) => marker.setIcon(createWebcamIcon(instance.L, id === selectedWebcamId)));
  }, [instance, selectedWebcamId]);

  // Deja la camara elegida a la vista, por encima de su tarjeta y de la barra del radar.
  useEffect(() => {
    if (!instance || selectedWebcamId === null) return;
    const cam = latest.current.webcams.find((candidate) => candidate.id === selectedWebcamId);
    if (!cam) return;
    instance.map.panInside?.([cam.lat, cam.lon], {
      paddingTopLeft: [40, 40],
      paddingBottomRight: [40, WEBCAM_PAN_BOTTOM_PX],
    });
  }, [instance, selectedWebcamId, latest]);

  return (
    <div className={[styles.wrapper, sheetOpen ? styles.sheetOpen : ""].filter(Boolean).join(" ")}>
      <div
        ref={containerRef}
        className={styles.map}
        role="region"
        aria-label="Mapa del Valle de Aburrá con temperatura por zona y capa de lluvia"
      />
      {failed ? <p className={styles.fallback}>No se pudo cargar el mapa. Revisa tu conexión y recarga la página.</p> : null}
    </div>
  );
}
