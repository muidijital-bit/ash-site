import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { getProductMedia } from "@/components/product/media";
import { ProductMedia } from "@/components/product/ProductMedia";
import { Ambient, HeroSignature } from "@/components/product/visuals";
import { getProductPage } from "@/content/product-pages";
import { getProducts } from "@/content/products";
import { SHOW_PRODUCT_DOMAINS } from "@/content/site";
import { hasLocale, localePath, type Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import "@/components/product/product.css";
import { ProductName } from "@/components/theme/shared/ProductName";

/* Urun ailesi dizini. */

export async function generateMetadata({ params }: PageProps<"/[lang]/products">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { productsIndex } = getUi(lang);
  return pageMetadata({ locale: lang, path: "/products", title: productsIndex.metaTitle, description: productsIndex.metaDescription });
}

export default async function Page({ params }: PageProps<"/[lang]/products">) {
  const locale = (await params).lang as Locale;
  const ui = getUi(locale);
  const { productsIndex } = ui;
  return (
    <>
    {/* Header, menu ve footer stilleri tema CSS'inde sayfa dosyalarina gomulu; urun sayfalari bunu yuklemezse header stilsiz kalir. */}
    <link rel="stylesheet" href="/theme/css/653b5fc3396b8f10-19b9ef9de6.css" precedence="page" />
    {/* pp--bands: bolumler beyaz/acik gri sirayla (anasayfadaki serit duzeni). */}
    <main className="pp pp--bands" style={{ "--p-accent": "#2f6bff", "--p-accent-2": "#7448e8" } as CSSProperties}>
      {/* Anasayfadaki "Neler Yapiyoruz" blogu gibi ortalanmis giris. */}
      <section className="pp-intro">
        <Ambient />
        <div className="pp-container pp-intro__content">
          <p className="pp-label">{productsIndex.label}</p>
          <h1 className="pp-h1">{productsIndex.title[0]}<span className="pp-grad-text">{productsIndex.title[1]}</span></h1>
          <p className="pp-lead">{productsIndex.lead}</p>
        </div>
      </section>

      {/* Her urun ekrana yayilan bir serit; bolumler beyaz/lacivert donusumlu.
          Gorsel tarafi urunun imza cizimi, taraf degisimli. */}
      {getProducts(locale).map((p, i) => {
        const [a, b] = p.accent;
        const page = getProductPage(locale, p.slug);
        const points = page?.sections.find((sec) => sec.kind === "farklar")?.items.slice(0, 3) ?? [];
        // Urun sayfasinin ust gorseli neyse serit de onu gosterir: hazir demo varsa o, yoksa imza cizimi.
        const media = getProductMedia(page?.hero.media);
        return (
          <section
            key={p.slug}
            className={`pp-section ${i % 2 === 0 ? "pp-section--light" : "pp-section--alt"}`}
            style={{ "--p-accent": a, "--p-accent-2": b } as CSSProperties}
          >
            <div className="pp-container">
              <div className="pp-showcase" data-flip={i % 2 ? "" : undefined}>
                <div className="pp-showcase__text">
                  <p className="pp-label pp-label--sm">{p.title}</p>
                  <h2 className="pp-showcase__name"><ProductName name={p.name} /></h2>
                  <p className="pp-showcase__summary">{page?.hero.lead ?? p.summary}</p>
                  {points.length > 0 && (
                    <ul className="pp-showcase__list">
                      {points.map((pt) => <li key={pt.title}>{pt.title}</li>)}
                    </ul>
                  )}
                  <Link href={localePath(locale, `/products/${p.slug}`)} className="pp-showcase__go">
                    {productsIndex.viewProduct} <span aria-hidden="true">→</span>
                  </Link>
                  {SHOW_PRODUCT_DOMAINS && <span className="pp-showcase__domain">{p.domain}</span>}
                </div>
                <div className="pp-showcase__visual">
                  {media
                    ? <ProductMedia media={media} locale={locale} />
                    : <HeroSignature slug={p.slug} locale={locale} />}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Sade iletisim seridi. */}
      <section className="pp-contact">
        <div className="pp-container pp-contact__inner">
          <p className="pp-contact__text">{productsIndex.strip}</p>
          <Link href={localePath(locale, "/contact")} className="pp-contact__link">
            {ui.getInTouch} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
    </>
  );
}
