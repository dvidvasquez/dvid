import type { Metadata, Viewport } from "next";
import { BottomNav } from "@/components/commons/BottomNav";
import { BRAND } from "@/constants/brand";
import { Outfit, Syne } from "next/font/google";
import "../styles/theme.css";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Mi Cuartel Digital",
  description: BRAND.description,
  applicationName: BRAND.name,
  appleWebApp: {
    capable: true,
    title: BRAND.name,
    statusBarStyle: "black",
  },
};

export const viewport: Viewport = {
  themeColor: BRAND.themeColor,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-28">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
