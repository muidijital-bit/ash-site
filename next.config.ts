import type { NextConfig } from "next";
import path from "node:path";

/**
 * NOT — dagitim bicimi:
 * Site Vercel'e cikiyor; orada ek bir ayar gerekmez. Docker gibi kendi
 * sunucunuza tasiyacaksaniz `output: "standalone"` ekleyin ve `public/`
 * ile `.next/static` klasorlerini elle kopyalayin (standalone bunlari
 * icermez; aksi halde site stilsiz acilir, gorseller 404 doner).
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
  // Kok layout dile gore ayrildigi icin (app/[lang]) eslesmeyen adreslerin
  // 404 sayfasi global-not-found.tsx ile sunucuda uretilir.
  experimental: { globalNotFound: true, serverActions: { bodySizeLimit: "4mb" } },
  devIndicators: false,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
    remotePatterns: process.env.NEXT_PUBLIC_SUPABASE_URL ? [{
      protocol: "https",
      hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname,
      pathname: "/storage/v1/object/public/ash-media/**",
      search: "",
    }] : [],
  },
  async headers() {
    return [
      { source: "/:path*", headers: guvenlikBasliklari },
      {
        // Gorseller icerik degisince ad degistigi icin uzun sureli onbelleklenebilir.
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }],
      },
      {
        // Videolar da ayni kurala tabi: icerik degisirse dosya adi degismeli.
        source: "/videos/:path*",
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
