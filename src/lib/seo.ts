import type { Metadata } from "next";
import { SITE_URL } from "@/content/site";
import { internalPath, localePath, pageAlternates, type Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";

/** Complete per-page metadata: nested Open Graph fields are not merged by Next. */
export function pageMetadata({ locale, path, title, description, absolute = false, publishedTime }: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  absolute?: boolean;
  publishedTime?: string;
}): Metadata {
  const ui = getUi(locale);
  const finalTitle = absolute ? title : `${title} — AI Solution House`;
  const alternates = pageAlternates(locale, path);
  const imagePath = /^\/(products|blog)\/[^/]+$/.test(path)
    ? `${internalPath(locale, path)}/opengraph-image`
    : `/${locale}/opengraph-image`;
  const image = { url: `${SITE_URL}${imagePath}`, width: 1200, height: 630, alt: finalTitle };
  return {
    title: { absolute: finalTitle },
    description,
    alternates,
    openGraph: {
      type: publishedTime ? "article" : "website",
      title: finalTitle,
      description,
      url: `${SITE_URL}${alternates.canonical}`,
      siteName: "AI Solution House",
      locale: ui.openGraphLocale,
      alternateLocale: [getUi(locale === "tr" ? "en" : "tr").openGraphLocale],
      images: [image],
      ...(publishedTime ? { publishedTime, modifiedTime: publishedTime, authors: ["AI Solution House"] } : {}),
    },
    twitter: { card: "summary_large_image", title: finalTitle, description, images: [image] },
  };
}

export function jsonLdString(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

/**
 * Sayfanin site icindeki yeri ("Ana sayfa > Urunler > SAPAI-X"); Google arama
 * sonucunda adres yerine bu izi gosterebilir. items: [ad, mantiksal yol].
 */
export function breadcrumbJsonLd(locale: Locale, items: [string, string][]) {
  const all: [string, string][] = [[getUi(locale).nav.home, "/"], ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: `${SITE_URL}${localePath(locale, path)}`,
    })),
  };
}
