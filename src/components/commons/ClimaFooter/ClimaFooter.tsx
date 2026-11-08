import { ActionButton } from "../ActionButton";
import styles from "./ClimaFooter.module.scss";

/** Fuentes de los datos y aviso de que no es una pagina oficial. */
export function ClimaFooter() {
  return (
    <footer className={styles.footer}>
      <p>
        Las burbujas del mapa muestran la temperatura de cada zona; las de borde azul tienen lluvia ahora. Toca una para
        ver su detalle. El radar viene de RainViewer, que tiene cobertura parcial en Colombia. Para el radar oficial y
        las estaciones, abre el geoportal de SIATA (enlace al final).
      </p>
      <p>
        Datos del modelo meteorológico de{" "}
        <a className={styles.link} href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">
          Open-Meteo
        </a>{" "}
        para cada zona, no de estaciones en tierra. Radar de{" "}
        <a className={styles.link} href="https://www.rainviewer.com/" target="_blank" rel="noopener noreferrer">
          RainViewer
        </a>
        . Mapa base de © OpenStreetMap. El botón de la cámara muestra webcams públicas de{" "}
        <a className={styles.link} href="https://www.windy.com/" target="_blank" rel="noopener noreferrer">
          Windy.com
        </a>
        : son fotos que se renuevan cada pocos minutos, no video continuo.
      </p>
      <p>
        Esta página no es oficial. Para alertas, estaciones y el radar propio del Valle de Aburrá, consulta SIATA.
      </p>
      <ActionButton href="https://geoportal.siata.gov.co/" className={styles.action}>
        Abrir geoportal de SIATA
      </ActionButton>
    </footer>
  );
}
