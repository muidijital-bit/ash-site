import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { HeroSection } from "@/components/theme/contact/HeroSection";
import { MapSection } from "@/components/theme/contact/MapSection";
import { hasLocale, type Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { contact } = getUi(lang);
  return pageMetadata({ locale: lang, path: "/contact", title: contact.metaTitle, description: contact.metaDescription });
}

export default async function Page({ params }: PageProps<"/[lang]/contact">) {
  const locale = (await params).lang as Locale;
  return (<>
    <link rel="stylesheet" href="/theme/css/e78a177f763a2d41-fa7ea74400.css" precedence="page" />
    <main>
      <HeroSection locale={locale} />
      <MapSection locale={locale} />
    </main>
  </>);
}
