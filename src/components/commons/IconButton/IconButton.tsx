import type { ComponentPropsWithRef, ReactNode } from "react";
import styles from "./IconButton.module.scss";

type IconButtonProps = Omit<ComponentPropsWithRef<"button">, "title" | "aria-label" | "children"> & {
  /** Texto accesible; tambien se usa como `title`. */
  label: string;
  size?: "md" | "sm";
  /** `overlay`: transparente con borde claro, para fondos oscuros o de color. */
  tone?: "default" | "overlay";
  busy?: boolean;
  children: ReactNode;
};

export function IconButton({
  label,
  size = "md",
  tone = "default",
  busy,
  className,
  type = "button",
  children,
  ...rest
}: IconButtonProps) {
  const classes = [styles.button, styles[size], tone === "overlay" ? styles.overlay : "", className]
    .filter(Boolean)
    .join(" ");
  return (
    <button type={type} className={classes} aria-label={label} title={label} aria-busy={busy || undefined} {...rest}>
      {children}
    </button>
  );
}
