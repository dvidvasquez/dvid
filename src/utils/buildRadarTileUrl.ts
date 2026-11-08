/** Plantilla de mosaicos de Leaflet para un cuadro del radar (color 2, suavizado, nieve). */
export function buildRadarTileUrl(host: string, path: string): string {
  return `${host}${path}/256/{z}/{x}/{y}/2/1_1.png`;
}
