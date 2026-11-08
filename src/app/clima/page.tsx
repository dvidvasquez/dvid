import type { Metadata } from "next";
import { ClimaDashboard } from "@/components/commons/ClimaDashboard";
import { getInitialClima } from "@/services/weather.service";

export const metadata: Metadata = {
  title: "Clima en vivo del Valle de Aburrá",
  description: "Temperatura por zona, radar de lluvia y cámaras públicas del Valle de Aburrá.",
};

// 5 minutos (CLIMA_REVALIDATE_SECONDS). Debe ser un literal para el analisis estatico de Next.
export const revalidate = 300;
const CLIMA_REVALIDATE_SECONDS = 300;

export default async function ClimaPage() {
  const initial = await getInitialClima(CLIMA_REVALIDATE_SECONDS);

  return (
    <>
      <h1 className="sr-only">Clima en vivo del Valle de Aburrá</h1>
      <ClimaDashboard initial={initial} />
    </>
  );
}
