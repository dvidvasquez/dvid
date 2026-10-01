import type { Metadata } from "next";
import { BottomNav } from "@/components/commons/BottomNav";
import { Outfit } from "next/font/google";
import "../styles/theme.css";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mi Cuartel Digital",
  description: "Feed combinado de blog, viajes y proyectos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-28">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
