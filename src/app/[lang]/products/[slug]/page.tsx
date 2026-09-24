import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { getUi } from "@/i18n/ui";
import { JsonLd } from "@/components/seo/JsonLd";
import { notFound } from "next/navigation";
import { ProductPage } from "@/components/product/ProductPage";
import { getProductPage } from "@/content/product-pages";
import { getProduct, products } from "@/content/products";
import { hasLocale, type Locale } from "@/i18n/config";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/products/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const content = getProductPage(lang, slug);
  if (!content) return {};
  return pageMetadata({ locale: lang, path: `/products/${slug}`, title: content.seoTitle, description: content.seoDescription, absolute: true });
}

export default async function Page({ params }: PageProps<"/[lang]/products/[slug]">) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const product = getProduct(slug, locale);
  const content = getProductPage(locale, slug);
  if (!product || !content) notFound();
  return (
    <>
      {/* Header, menu ve footer stilleri tema CSS'inde sayfa dosyalarina gomulu; urun sayfalari bunu yuklemezse header stilsiz kalir. */}
      <link rel="stylesheet" href="/theme/css/653b5fc3396b8f10-19b9ef9de6.css" precedence="page" />
      <JsonLd data={breadcrumbJsonLd(locale, [[getUi(locale).nav.products, "/products"], [product.name, `/products/${slug}`]])} />
      <ProductPage product={product} content={content} locale={locale} />
    </>
  );
}
