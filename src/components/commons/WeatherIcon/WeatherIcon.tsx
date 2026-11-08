import type { ReactNode } from "react";
import type { WeatherKind } from "@/types/weather";

const SUN = (
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
  </>
);
const MOON = <path d="M20 14.2A8.2 8.2 0 1 1 9.8 4a6.6 6.6 0 0 0 10.2 10.2z" />;
const CLOUD = <path d="M7.5 19h9.2a4.2 4.2 0 0 0 .6-8.36A5.8 5.8 0 0 0 6.2 11.6 3.7 3.7 0 0 0 7.5 19z" />;
const CLOUD_HIGH = <path d="M7.5 15h9.2a3.9 3.9 0 0 0 .5-7.77A5.4 5.4 0 0 0 6.4 8.5 3.3 3.3 0 0 0 7.5 15z" />;
const CLOUD_PART = <path d="M9.5 20h8.2a3.6 3.6 0 0 0 .5-7.17A5 5 0 0 0 8.6 14a3.1 3.1 0 0 0 .9 6z" />;
const SUN_SMALL = (
  <>
    <circle cx="7" cy="7" r="2.8" />
    <path d="M7 1.6v1.2M1.6 7h1.2M3.2 3.2l.9.9M10.8 3.2l-.9.9" />
  </>
);
const MOON_SMALL = <path d="M9.6 8.4A3.5 3.5 0 1 1 5.6 3.4a2.8 2.8 0 0 0 4 5z" />;
const DROPS = <path d="M8 18l-1 3M12.5 18l-1 3M17 18l-1 3" />;
const DRIZZLE = <path d="M8 18.2l-.5 1.6M12.5 18.2l-.5 1.6M17 18.2l-.5 1.6" />;
const BOLT = <path d="M12.8 14.5l-2.6 3.8h3.2l-1.8 3.7" />;
const FLAKES = <path d="M8 18.5v.01M12 20.5v.01M16 18.5v.01" strokeWidth="2.6" />;
const FOG = <path d="M3 9h14M6 13h15M3 17h12M8 21h10" />;

function getBody(kind: WeatherKind, isDay: boolean): ReactNode {
  switch (kind) {
    case "clear":
      return isDay ? SUN : MOON;
    case "partly":
      return (
        <>
          {isDay ? SUN_SMALL : MOON_SMALL}
          {CLOUD_PART}
        </>
      );
    case "fog":
      return FOG;
    case "drizzle":
      return (
        <>
          {CLOUD_HIGH}
          {DRIZZLE}
        </>
      );
    case "rain":
      return (
        <>
          {CLOUD_HIGH}
          {DROPS}
        </>
      );
    case "storm":
      return (
        <>
          {CLOUD_HIGH}
          {BOLT}
        </>
      );
    case "snow":
      return (
        <>
          {CLOUD_HIGH}
          {FLAKES}
        </>
      );
    default:
      return CLOUD;
  }
}

/** Icono lineal del tiempo; toma el color del texto (`currentColor`) y el tamano de su contenedor. */
export function WeatherIcon({ kind, isDay }: { kind: WeatherKind; isDay: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {getBody(kind, isDay)}
    </svg>
  );
}
