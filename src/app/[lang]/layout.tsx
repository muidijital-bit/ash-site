import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeaderMarkup } from "@/components/theme/shared/HeaderMarkup";
import { FooterMarkup } from "@/components/theme/shared/FooterMarkup";
import { SiteFrame } from "@/components/theme/shared/SiteFrame";
import { hasLocale, locales, pageAlternates } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import { INDEXABLE, SITE_URL } from "@/content/site";
import { getBrandSettings } from "@/lib/cms/public";
import { SiteSettingsProvider } from "@/components/cms/SiteSettingsProvider";
import { BlogLanguageProvider } from "@/components/blog/BlogLanguageLinks";
import "../globals.css";
import "../brand.css";
// blog.css tek yerden: 404 siniri kok duzenle birlikte yuklendigi icin bu dosya
// zaten her sayfada vardi. Sayfalar da ayrica aktarinca ayni CSS iki pakete
// giriyor, gelistirme sunucusu sayfa gecisinde "No link element found for
// chunk" hatasi veriyordu. Sayfa duzeyinde tekrar aktarilmamali.
import "@/components/blog/blog.css";


/** Iki dil de derleme aninda uretilir; baska bir dil 404 doner. */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const ui = getUi(lang);
  const settings = await getBrandSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: ui.siteTitle, template: "%s — AI Solution House" },
    description: ui.siteDescription,
    alternates: pageAlternates(lang, "/"),
    openGraph: {
      type: "website",
      siteName: "AI Solution House",
      locale: ui.openGraphLocale,
      url: pageAlternates(lang, "/").canonical,
    },
    icons: { icon: settings.favicon, apple: settings.favicon.endsWith(".svg") ? undefined : settings.favicon },
    robots: INDEXABLE
      ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } }
      : { index: false, follow: false },
    verification: process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : undefined,
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const settings = await getBrandSettings();
  return (
    <html lang={lang} data-scroll-behavior="smooth">
      <head>
        <link rel="stylesheet" href="/theme/css/65b096ee3798f49e-9605c14cc6.css" precedence="base" />
      </head>
      <body>
        <SiteSettingsProvider settings={settings}><BlogLanguageProvider>
        <SiteFrame locale={lang} header={<HeaderMarkup locale={lang} />} footer={<FooterMarkup locale={lang} />}>
          {children}
        </SiteFrame>
        </BlogLanguageProvider></SiteSettingsProvider>
      </body>
    </html>
  );
}
