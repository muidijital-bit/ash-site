import { OG_CONTENT_TYPE, OG_SIZE, ogCard, ogClamp } from "@/components/og/card";
import { getProductPage } from "@/content/product-pages";
import { getProduct, products } from "@/content/products";
import { defaultLocale, hasLocale } from "@/i18n/config";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AI Solution House";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const locale = hasLocale(lang) ? lang : defaultLocale;
  const product = getProduct(slug, locale);
  const content = getProductPage(locale, slug);
  return ogCard({
    locale,
    eyebrow: product?.name ?? "ASH",
    // Baslikta vurgu icin kullanilan <span> etiketleri gorsele girmemeli.
    title: ogClamp((content?.hero.title ?? product?.name ?? "").replace(/<[^>]+>/g, ""), 78),
    note: ogClamp(content?.hero.lead ?? product?.summary ?? "", 120),
  });
}
