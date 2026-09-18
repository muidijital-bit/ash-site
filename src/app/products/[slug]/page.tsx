import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPage } from "@/components/product/ProductPage";
import { productPages } from "@/content/product-pages";
import { getProduct, products } from "@/content/products";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const content = productPages[slug];
  if (!content) return {};
  return {
    title: { absolute: content.seoTitle },
    description: content.seoDescription,
    alternates: { canonical: `/products/${slug}` },
    openGraph: { title: content.seoTitle, description: content.seoDescription, url: `/products/${slug}` },
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const product = getProduct(slug);
  const content = productPages[slug];
  if (!product || !content) notFound();
  return (
    <>
      {/* Header, menu ve footer stilleri tema CSS'inde sayfa dosyalarina gomulu; urun sayfalari bunu yuklemezse header stilsiz kalir. */}
      <link rel="stylesheet" href="/theme/css/653b5fc3396b8f10-19b9ef9de6.css" precedence="page" />
      <ProductPage product={product} content={content} />
    </>
  );
}
