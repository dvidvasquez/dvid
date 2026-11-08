import type { MouseEventHandler, ReactNode } from "react";
import styles from "./ActionButton.module.scss";

type ActionButtonProps = {
  children: ReactNode;
  className?: string;
} & (
  | { href: string; onClick?: undefined }
  | { href?: undefined; onClick: MouseEventHandler<HTMLButtonElement> }
);

/** Boton con borde. Con `href` es un enlace externo que abre en pestana nueva. */
export function ActionButton({ children, className, href, onClick }: ActionButtonProps) {
  const classes = [styles.action, className].filter(Boolean).join(" ");
  if (href !== undefined) {
    return (
      <a className={classes} href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
