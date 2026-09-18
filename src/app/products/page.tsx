import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Ambient, HeroSignature } from "@/components/product/visuals";
import { productPages } from "@/content/product-pages";
import { products } from "@/content/products";
import "@/components/product/product.css";

/* Urun ailesi dizini. */

export const metadata: Metadata = {
  title: "Ürünler",
  description:
    "Kurumsal yapay zekâ, SAP, masraf ve müşteri yönetimi için ASH ürün ailesi: HubAI-X, SAPAI-X, Masraf-X ve CRM-X.",
  alternates: { canonical: "/products" },
};

const ACCENTS: Record<string, [string, string]> = {
  "hubai-x": ["#2f6bff", "#7448e8"],
  "sapai-x": ["#7448e8", "#2f6bff"],
  "masraf-x": ["#d946b5", "#f08bc2"],
  "crm-x": ["#7448e8", "#d946b5"],
};

export default function Page() {
  return (
    <>
    {/* Header, menu ve footer stilleri tema CSS'inde sayfa dosyalarina gomulu; urun sayfalari bunu yuklemezse header stilsiz kalir. */}
    <link rel="stylesheet" href="/theme/css/653b5fc3396b8f10-19b9ef9de6.css" precedence="page" />
    <main className="pp" style={{ "--p-accent": "#2f6bff", "--p-accent-2": "#7448e8" } as CSSProperties}>
      {/* Anasayfadaki "Neler Yapiyoruz" blogu gibi ortalanmis giris. */}
      <section className="pp-intro">
        <Ambient />
        <div className="pp-container pp-intro__content">
          <p className="pp-label">Ürün ailemiz</p>
          <h1 className="pp-h1">Kurumsal süreçleri yeniden <span className="pp-grad-text">tasarlayan ürünler</span></h1>
          <p className="pp-lead">
            Her biri kurumsal bir ihtiyaçtan doğdu, sahada çalışan ekiplerle birlikte olgunlaştı. Dört ürün, tek bir
            yaklaşım: mevcut sisteminizi anlayan, onayınız olmadan işlem yapmayan yapay zekâ.
          </p>
        </div>
      </section>

      {/* Her urun ekrana yayilan bir serit; bolumler beyaz/lacivert donusumlu.
          Gorsel tarafi urunun imza cizimi, taraf degisimli. */}
      {products.map((p, i) => {
        const [a, b] = ACCENTS[p.slug] ?? ["#2f6bff", "#7448e8"];
        const page = productPages[p.slug];
        const points = page?.sections.find((sec) => sec.kind === "farklar")?.items.slice(0, 3) ?? [];
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
                  <h2 className="pp-showcase__name">{p.name}</h2>
                  <p className="pp-showcase__summary">{page?.hero.lead ?? p.summary}</p>
                  {points.length > 0 && (
                    <ul className="pp-showcase__list">
                      {points.map((pt) => <li key={pt.title}>{pt.title}</li>)}
                    </ul>
                  )}
                  <Link href={`/products/${p.slug}`} className="pp-showcase__go">
                    Ürünü incele <span aria-hidden="true">→</span>
                  </Link>
                  <span className="pp-showcase__domain">{p.domain}</span>
                </div>
                <div className="pp-showcase__visual">
                  <HeroSignature slug={p.slug} />
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Sade iletisim seridi. */}
      <section className="pp-contact">
        <div className="pp-container pp-contact__inner">
          <p className="pp-contact__text">Hangi ürünün size uygun olduğunu birlikte belirleyelim.</p>
          <Link href="/contact" className="pp-contact__link">
            İletişime geçin <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
    </>
  );
}
