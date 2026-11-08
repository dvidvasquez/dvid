"use client";

import { useEffect, useMemo, useState } from "react";
import { CLIMA_PLACES, DEFAULT_PLACE } from "@/constants/climaPlaces";
import { useForecast } from "@/hooks/useForecast";
import { useNow } from "@/hooks/useNow";
import { useRadar } from "@/hooks/useRadar";
import { useStoredString } from "@/hooks/useStoredString";
import { useWebcams } from "@/hooks/useWebcams";
import type { ClimaInitialData } from "@/services/weather.service";
import { buildHourlySeries } from "@/utils/buildHourlySeries";
import { findNearestPlace } from "@/utils/findNearestPlace";
import { findPlaceById } from "@/utils/findPlaceById";
import { getLiveStatus } from "@/utils/getLiveStatus";
import { getPhotoAgeLabel } from "@/utils/getPhotoAgeLabel";
import { getRainOutlook } from "@/utils/getRainOutlook";
import { getStampText } from "@/utils/getStampText";
import { getWebcamForecastLine } from "@/utils/getWebcamForecastLine";
import { getWebcamPhotoUrl } from "@/utils/getWebcamPhotoUrl";
import { toSafeHttpsUrl } from "@/utils/toSafeHttpsUrl";
import { ClimaFooter } from "../ClimaFooter";
import { ClimaMap } from "../ClimaMap";
import { CurrentMetrics } from "../CurrentMetrics";
import { DailyForecast } from "../DailyForecast";
import { DetailsSheet } from "../DetailsSheet";
import { HourlyCharts } from "../HourlyCharts";
import { MapToast } from "../MapToast";
import { MapTools } from "../MapTools";
import { RadarBar } from "../RadarBar";
import { StatusBanner } from "../StatusBanner";
import { WeatherCard } from "../WeatherCard";
import { WebcamCard } from "../WebcamCard";
import { WebcamViewer } from "../WebcamViewer";
import styles from "./ClimaDashboard.module.scss";

const PLACE_STORAGE_KEY = "clima-valle-lugar";
const CARD_STORAGE_KEY = "clima-valle-tarjeta";

/**
 * Pantalla del clima: mapa a pantalla completa con tarjeta flotante, radar, camaras y un panel de detalles.
 * Aqui solo se juntan los datos (hooks) y se reparten a cada componente.
 */
export function ClimaDashboard({ initial }: { initial: ClimaInitialData | null }) {
  const [storedPlaceId, setStoredPlaceId] = useStoredString(PLACE_STORAGE_KEY, DEFAULT_PLACE.id);
  const [cardState, setCardState] = useStoredString(CARD_STORAGE_KEY, "0");
  const place = findPlaceById(CLIMA_PLACES, storedPlaceId) ?? DEFAULT_PLACE;
  const collapsed = cardState === "1";

  const [sheetOpen, setSheetOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const now = useNow(30_000);

  const { forecast, forecastPlaceId, snapshots, fetchedAt, error, refreshing, refresh } = useForecast(place, initial);
  const radar = useRadar();
  const { reload: reloadRadar } = radar;
  const {
    enabled: webcamsEnabled,
    list: webcamList,
    selected: selectedCam,
    toast: webcamToast,
    imageFailed,
    toggle: toggleWebcams,
    select: selectWebcam,
    close: closeWebcam,
    onImageError,
  } = useWebcams();

  const series = useMemo(() => (forecast ? buildHourlySeries(forecast) : null), [forecast]);
  const outlook = forecast && series ? getRainOutlook(forecast.current, forecast.hourly, series.startIndex) : null;
  const today = forecast?.daily[0] ?? null;
  const dataPlace = findPlaceById(CLIMA_PLACES, forecastPlaceId) ?? place;

  // Pestana del navegador: temperatura y lugar.
  useEffect(() => {
    if (forecast) document.title = `${Math.round(forecast.current.temperature)}° en ${dataPlace.name} - Clima en vivo`;
  }, [forecast, dataPlace.name]);

  // Escape cierra lo ultimo que se abrio: foto, detalles o camara.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (viewerOpen) setViewerOpen(false);
      else if (sheetOpen) setSheetOpen(false);
      else if (selectedCam) closeWebcam();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [viewerOpen, sheetOpen, selectedCam, closeWebcam]);

  const camPhoto = selectedCam ? getWebcamPhotoUrl(selectedCam) : null;
  const camPlace = selectedCam ? findNearestPlace(selectedCam.lat, selectedCam.lon, CLIMA_PLACES) : null;
  const camSnapshot = camPlace ? snapshots[camPlace.id] : undefined;
  const camForecastLine = camPlace && camSnapshot ? getWebcamForecastLine(camPlace, camSnapshot) : null;
  const camAge = selectedCam
    ? imageFailed
      ? "No se pudo cargar la foto. Ábrela en Windy."
      : getPhotoAgeLabel(selectedCam.updatedAt, now)
    : "";

  const handleSelectWebcam = (id: number) => {
    setViewerOpen(false);
    selectWebcam(id);
  };
  const handleCloseWebcam = () => {
    setViewerOpen(false);
    closeWebcam();
  };

  return (
    <>
      <div className={styles.stage}>
        <ClimaMap
          places={CLIMA_PLACES}
          selectedPlaceId={place.id}
          snapshots={snapshots}
          radar={radar.maps}
          radarIndex={radar.index}
          webcams={webcamList}
          showWebcams={webcamsEnabled}
          selectedWebcamId={selectedCam?.id ?? null}
          sheetOpen={sheetOpen}
          onSelectPlace={setStoredPlaceId}
          onSelectWebcam={handleSelectWebcam}
        />
        <div className={styles.hud}>
          <WeatherCard
            places={CLIMA_PLACES}
            placeId={place.id}
            onPlaceChange={setStoredPlaceId}
            current={forecast?.current ?? null}
            today={today}
            outlook={outlook}
            stampText={getStampText({ dataTime: forecast?.current.time ?? null, error, fetchedAt, now })}
            status={getLiveStatus({ error, fetchedAt, now })}
            collapsed={collapsed}
            onToggleCollapsed={() => setCardState(collapsed ? "0" : "1")}
            loading={refreshing && forecastPlaceId !== place.id}
          />
          <MapTools
            refreshing={refreshing}
            onRefresh={() => {
              refresh();
              reloadRadar();
            }}
            webcamsEnabled={webcamsEnabled}
            onToggleWebcams={() => void toggleWebcams()}
            sheetOpen={sheetOpen}
            onToggleSheet={() => setSheetOpen((open) => !open)}
            shifted={sheetOpen}
          />
          {error ? <StatusBanner onRetry={refresh} /> : null}
          {selectedCam ? (
            <WebcamCard
              cam={selectedCam}
              now={now}
              forecastLine={camForecastLine}
              imageFailed={imageFailed}
              onClose={handleCloseWebcam}
              onOpenViewer={() => setViewerOpen(true)}
              onImageError={onImageError}
            />
          ) : null}
          {webcamToast ? <MapToast message={webcamToast} /> : null}
          <RadarBar
            frames={radar.maps?.frames ?? null}
            status={radar.status}
            index={radar.index}
            playing={radar.playing}
            now={now}
            onTogglePlay={radar.togglePlay}
            onSeek={radar.seek}
            shifted={sheetOpen}
          />
        </div>
      </div>

      {sheetOpen ? (
        <DetailsSheet onClose={() => setSheetOpen(false)}>
          {forecast && series && today ? (
            <>
              <CurrentMetrics current={forecast.current} today={today} />
              <HourlyCharts points={series.points} />
              <DailyForecast days={forecast.daily} />
            </>
          ) : (
            <p className={styles.empty}>Cargando datos del clima…</p>
          )}
          <ClimaFooter />
        </DetailsSheet>
      ) : null}

      {viewerOpen && selectedCam && camPhoto ? (
        <WebcamViewer
          title={selectedCam.title}
          src={camPhoto}
          subtitle={camAge}
          forecastLine={camForecastLine}
          pageUrl={toSafeHttpsUrl(selectedCam.pageUrl)}
          onClose={() => setViewerOpen(false)}
        />
      ) : null}
    </>
  );
}
