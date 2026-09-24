import { getBrandSettings } from "@/lib/cms/public";
import { jsonLdString, pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { HomeMotion } from "@/components/theme/home/HomeMotion";
import { HeroSection } from "@/components/theme/home/HeroSection";
import { WhatWeDoSection } from "@/components/theme/home/WhatWeDoSection";
import { InvestmentsSection } from "@/components/theme/home/InvestmentsSection";
import { HowWeWorkSection } from "@/components/theme/home/HowWeWorkSection";
import { ProcessSection } from "@/components/theme/home/ProcessSection";
import { MeetingSection } from "@/components/theme/home/MeetingSection";
import { LatestNewsSection } from "@/components/theme/home/LatestNewsSection";
import { SITE_URL } from "@/content/site";
import { contact } from "@/content/contact";
import { hasLocale, type Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const ui = getUi(lang);
  return pageMetadata({ locale: lang, path: "/", title: ui.siteTitle, description: ui.siteDescription, absolute: true });
}

export default async function Page({ params }: PageProps<"/[lang]">) {
  const locale = (await params).lang as Locale;
  const ui = getUi(locale);
  const settings = await getBrandSettings();
  // Arama motorlarina kurum ve site bilgisi (JSON-LD).
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#kurum`,
        name: "AI Solution House",
        alternateName: "ASH",
        url: SITE_URL,
        logo: new URL(settings.logoLight, SITE_URL).toString(),
        description: ui.siteDescription,
        email: contact.email,
        address: contact.offices.map(({ address: a }) => ({
          "@type": "PostalAddress",
          streetAddress: a.street,
          addressLocality: a.locality,
          ...(a.region ? { addressRegion: a.region } : {}),
          postalCode: a.postalCode,
          addressCountry: a.country,
        })),
        contactPoint: { "@type": "ContactPoint", contactType: "sales", email: contact.email, availableLanguage: ["tr", "en"] },
        areaServed: ["TR", "GB"],
        knowsAbout: ui.knowsAbout,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#site`,
        url: SITE_URL,
        name: "AI Solution House",
        inLanguage: ui.blog.inLanguage,
        publisher: { "@id": `${SITE_URL}/#kurum` },
      },
    ],
  };
  return (<>
    <link rel="stylesheet" href="/theme/css/e603559e0d418cf3-9edf77a3bb.css" precedence="page" />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
    <HomeMotion locale={locale}>
      <HeroSection locale={locale} />
      <WhatWeDoSection locale={locale} />
      <InvestmentsSection locale={locale} />
      <HowWeWorkSection locale={locale} />
      <ProcessSection locale={locale} />
      <MeetingSection locale={locale} />
      <LatestNewsSection locale={locale} />
    </HomeMotion>
  </>);
}
