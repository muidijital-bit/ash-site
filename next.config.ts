import type { NextConfig } from "next";
import path from "node:path";

/**
 * NOT — output: "standalone":
 * Bu mod yalnizca sunucu dosyalarini .next/standalone altina kopyalar;
 * `public/` ve `.next/static` DAHIL EDILMEZ. Docker gibi bir ortama
 * tasiyacaksaniz ikisini de elle kopyalamaniz gerekir, aksi halde site
 * stilsiz acilir ve gorseller 404 doner. Vercel benzeri bir platforma
 * cikacaksaniz bu satiri tamamen kaldirin.
 */

const guvenlikBasliklari = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  turbopack: { root: path.resolve(__dirname) },
  devIndicators: false,
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: guvenlikBasliklari },
      {
        // Gorseller icerik degisince ad degistigi icin uzun sureli onbelleklenebilir.
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }],
      },
      {
        source: "/theme/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }],
      },
    ];
  },
};

export default nextConfig;
