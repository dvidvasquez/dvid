import type { Metadata } from "next";
import { BottomNav } from "@/components/commons/BottomNav";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/theme.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-28">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
