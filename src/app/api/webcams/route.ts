import { getWebcams } from "@/services/webcams.service";

/**
 * Las URLs de imagen de Windy caducan a los 10 minutos (plan gratis): se cachea en
 * el borde 4 minutos como maximo para que siempre quede margen de vida util.
 */
const OK_CACHE_CONTROL = "public, max-age=60, s-maxage=240";
const NO_STORE = "no-store";

export async function GET() {
  const result = await getWebcams();

  if (result.ok) {
    return Response.json(
      { webcams: result.webcams, fetchedAt: result.fetchedAt },
      { headers: { "Cache-Control": OK_CACHE_CONTROL } },
    );
  }

  // El error nunca incluye la key ni el cuerpo de la respuesta de Windy.
  const status = result.reason === "no-key" ? 503 : 502;
  return Response.json(
    { error: result.reason, upstreamStatus: result.status ?? null },
    { status, headers: { "Cache-Control": NO_STORE } },
  );
}
