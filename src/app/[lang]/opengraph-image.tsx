import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/components/og/card";
import { defaultLocale, hasLocale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";

/* Site geneli paylasim gorseli; alt sayfalar kendi gorselini tanimlamazsa bu kullanilir. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AI Solution House";

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : defaultLocale;
  const ui = getUi(locale);
  return ogCard({
    locale,
    eyebrow: locale === "en" ? "Enterprise AI" : "Kurumsal Yapay Zekâ",
    title: locale === "en" ? "Enterprise Solutions, Reimagined with AI" : "Kurumsal Çözümler, Yapay Zekâ ile Yeniden Tanımlanıyor",
    note: ui.nav.products + " · HubAI-X · SAPAI-X · Masraf-X · CRM-X",
  });
}
