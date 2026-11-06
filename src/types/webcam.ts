/** Camara normalizada para la UI. Las URLs de imagen caducan (10 min en el plan gratis de Windy). */
export type Webcam = {
  id: number;
  title: string;
  lat: number;
  lon: number;
  thumbnail: string | null;
  preview: string | null;
  /** Pagina de la camara en windy.com (obligatorio enlazar cada imagen). */
  pageUrl: string | null;
  /** Reproductor en vivo, si la camara lo ofrece. */
  liveUrl: string | null;
  /** Reproductor de timelapse del dia. */
  dayUrl: string | null;
  /** ISO 8601 de la ultima actualizacion de la imagen. */
  updatedAt: string | null;
};
