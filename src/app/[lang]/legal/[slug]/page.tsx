import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/legal/LegalPage";
import { getLegalDoc, getLegalDocs } from "@/content/legal";
import { hasLocale, type Locale } from "@/i18n/config";

export const dynamicParams = false;

/** Her dil kendi slug'lariyla uretilir: /yasal/<turkce>, /en/legal/<ingilizce>. */
export async function generateStaticParams({ params }: { params: { lang: string } }) {
  return hasLocale(params.lang) ? getLegalDocs(params.lang).map((doc) => ({ slug: doc.slug })) : [];
}

export async function generateMetadata({ params }: PageProps<"/[lang]/legal/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const doc = getLegalDoc(lang, slug);
  if (!doc) return {};
  return pageMetadata({ locale: lang, path: `/legal/${doc.key}`, title: doc.title, description: doc.metaDescription });
}

export default async function Page({ params }: PageProps<"/[lang]/legal/[slug]">) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const doc = getLegalDoc(locale, slug);
  if (!doc) notFound();
  return (
    <>
      {/* Header, menu ve footer stilleri tema CSS'inde sayfa dosyalarina gomulu. */}
      <link rel="stylesheet" href="/theme/css/653b5fc3396b8f10-19b9ef9de6.css" precedence="page" />
      <JsonLd data={breadcrumbJsonLd(locale, [[doc.title, `/legal/${doc.key}`]])} />
      <LegalPage doc={doc} locale={locale} />
    </>
  );
}
