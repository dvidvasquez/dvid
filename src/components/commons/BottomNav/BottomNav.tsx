"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./BottomNav.module.scss";
import { NAV_ITEMS } from "@/constants/navItems";

function isItemActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.wrapper} aria-label="Navegacion principal">
      <ul className={styles.list}>
        {NAV_ITEMS.map((item) => {
          const active = isItemActive(pathname, item.href);
          const Icon = active ? item.activeIcon : item.icon;

          const className = `${styles.link} ${active ? styles.active : ""}`;
          const content = (
            <>
              <Icon className={styles.icon} aria-hidden="true" />
              <span className={styles.label}>{item.label}</span>
            </>
          );

          return (
            <li key={item.href}>
              {item.staticPage ? (
                <a href={item.href} className={className} title={item.label}>
                  {content}
                </a>
              ) : (
                <Link
                  href={item.href}
                  className={className}
                  aria-current={active ? "page" : undefined}
                  title={item.label}
                >
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
