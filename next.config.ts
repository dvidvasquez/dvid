import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      // La herramienta de clima ahora es la ruta /clima; se conservan los enlaces y accesos directos viejos.
      { source: "/clima-medellin.html", destination: "/clima", permanent: false },
    ];
  },
};

export default nextConfig;
