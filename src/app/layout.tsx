import type { Metadata } from "next";
import { HeaderMarkup } from "@/components/theme/shared/HeaderMarkup";
import { FooterMarkup } from "@/components/theme/shared/FooterMarkup";
import { SiteFrame } from "@/components/theme/shared/SiteFrame";
import "./globals.css";
import "./brand.css";

/**
 * Kanonik adres ve og: gorsel baglantilari bundan turetiliyor.
 * Yayina cikarken NEXT_PUBLIC_SITE_URL degerini gercek alan adiyla tanimlayin.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Gercek alan adi tanimlanana kadar site aramaya kapali kalir. */
const yayinda = Boolean(process.env.NEXT_PUBLIC_SITE_URL);

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AI Solution House — Kurumsal Yapay Zekâ Çözümleri",
    template: "%s — AI Solution House",
  },
  description: "Karmaşık operasyonları sadeleştiren, süreçleri otomatikleştiren yapay zekâ destekli kurumsal çözümler. HubAI-X, SAPAI-X, Masraf-X ve CRM-X.",
  openGraph: {
    type: "website",
    siteName: "AI Solution House",
    locale: "tr_TR",
    url: "/",
  },
  icons: { icon: "/theme/favicon.svg" },
  robots: yayinda ? undefined : { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" data-scroll-behavior="smooth">
      <head>
        <link rel="stylesheet" href="/theme/css/65b096ee3798f49e-9605c14cc6.css" precedence="base" />
      </head>
      <body>
        <SiteFrame header={<HeaderMarkup />} footer={<FooterMarkup />}>{children}</SiteFrame>
      </body>
    </html>
  );
}
