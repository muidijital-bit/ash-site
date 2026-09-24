import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { HeroSection } from "@/components/theme/our-dna/HeroSection";
import { OurMissionSection } from "@/components/theme/our-dna/OurMissionSection";
import { ValuesSection } from "@/components/theme/our-dna/ValuesSection";
import { ProcessSection } from "@/components/theme/our-dna/ProcessSection";
import { hasLocale, type Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";

export async function generateMetadata({ params }: PageProps<"/[lang]/why-ash">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { why } = getUi(lang);
  return pageMetadata({ locale: lang, path: "/why-ash", title: why.metaTitle, description: why.metaDescription });
}

export default async function Page({ params }: PageProps<"/[lang]/why-ash">) {
  const locale = (await params).lang as Locale;
  return (<>
    <link rel="stylesheet" href="/theme/css/aa8a819d9c67563a-0133a7d1e7.css" precedence="page" />
    <JsonLd data={breadcrumbJsonLd(locale, [[getUi(locale).nav.why, "/why-ash"]])} />
    <main>
      <HeroSection locale={locale} />
      <OurMissionSection locale={locale} />
      <ValuesSection locale={locale} />
      <ProcessSection locale={locale} />
    </main>
  </>);
}
