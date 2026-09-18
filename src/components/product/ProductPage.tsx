import Link from "next/link";
import type { CSSProperties } from "react";
import { products, type Product } from "@/content/products";
import type { ProductPageContent, ProductSection } from "./types";
import { UseCaseTabs } from "./UseCaseTabs";
import { Ambient, Blueprint, Crosshair, FeatureMock, HeroSignature } from "./visuals";
import "./product.css";

/** Her urunun kimligi tek degisken ciftiyle tasinir; bilesenler bunu okur. */
const ACCENTS: Record<string, [string, string]> = {
  "hubai-x": ["#2f6bff", "#7448e8"],
  "sapai-x": ["#7448e8", "#2f6bff"],
  "masraf-x": ["#d946b5", "#f08bc2"],
  "crm-x": ["#7448e8", "#d946b5"],
};

/**
 * Basligin vurgulanacak kismini ayirir.
 * Icerikte <span>...</span> varsa o kisim vurgulanir; yoksa son cumle ya da
 * son obek ("A. B" -> "A." + "B", "A, B" -> "A," + "B").
 */
function splitAccent(title: string): [string, string] {
  const marked = title.match(/^([\s\S]*?)<span>([\s\S]*?)<\/span>\s*$/);
  if (marked) return [marked[1], marked[2]];
  const clean = title.replace(/<[^>]+>/g, "").trim();
  for (const sep of [". ", " — ", " – ", ": ", ", "]) {
    const i = clean.lastIndexOf(sep);
    if (i > 0 && i < clean.length - sep.length) return [clean.slice(0, i + sep.length), clean.slice(i + sep.length)];
  }
  const words = clean.split(" ");
  if (words.length < 4) return ["", clean];
  return [words.slice(0, -2).join(" ") + " ", words.slice(-2).join(" ")];
}

function Heading({ as: Tag = "h2", text, className }: { as?: "h1" | "h2"; text: string; className: string }) {
  const [lead, accent] = splitAccent(text);
  return <Tag className={className}>{lead}<span className="pp-grad-text">{accent}</span></Tag>;
}

function SectionHead({ eyebrow, section }: { eyebrow: string; section: ProductSection }) {
  return (
    <header className="pp-head">
      <p className="pp-label">{eyebrow}</p>
      <Heading text={section.heading} className="pp-h2" />
      {section.sub && <p className="pp-lead">{section.sub}</p>}
    </header>
  );
}

const EYEBROW: Record<string, string> = {
  ozellikler: "Özellikler",
  "nasil-calisir": "Nasıl çalışır",
  farklar: "Farkımız",
  "kullanim-senaryolari": "Kullanım senaryoları",
  istatistik: "Neler kazanırsınız",
  sss: "Sık sorulan sorular",
};

/* ------------------------------------------------------------------ */

function Features({ section, slug }: { section: ProductSection; slug: string }) {
  return (
    <>
      <SectionHead eyebrow={EYEBROW.ozellikler} section={section} />
      <div className="pp-zigzag">
        {section.items.map((item, i) => (
          <article key={item.title} className="pp-zig" data-flip={i % 2 ? "" : undefined}>
            <div className="pp-zig__text">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
            <div className="pp-zig__visual"><FeatureMock slug={slug} variant={i} /></div>
          </article>
        ))}
      </div>
    </>
  );
}

function Differences({ section }: { section: ProductSection }) {
  return (
    <>
      <SectionHead eyebrow={EYEBROW.farklar} section={section} />
      <div className="pp-hairgrid" data-count={section.items.length}>
        {section.items.map((item) => (
          <article key={item.title} className="pp-card">
            <Crosshair />
            <span className="pp-card__rule" aria-hidden="true" />
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </>
  );
}

function Flow({ section }: { section: ProductSection }) {
  return (
    <>
      <SectionHead eyebrow={EYEBROW["nasil-calisir"]} section={section} />
      <ol className="pp-flow" style={{ "--steps": section.items.length } as CSSProperties}>
        {section.items.map((item, i) => (
          <li key={item.title} className="pp-flow__step">
            <span className="pp-flow__node">{i + 1}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </li>
        ))}
      </ol>
    </>
  );
}

function Capabilities({ section }: { section: ProductSection }) {
  return (
    <>
      <SectionHead eyebrow={EYEBROW.istatistik} section={section} />
      <div className="pp-band">
        {section.items.map((item) => (
          <div key={item.title} className="pp-band__cell">
            <svg className="pp-dial" viewBox="0 0 88 88" aria-hidden="true">
              <circle cx="44" cy="44" r="38" className="pp-dial__track" />
              <circle cx="44" cy="44" r="38" className="pp-dial__arc" />
            </svg>
            <strong>{item.title}</strong>
            <p>{item.body}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function Faq({ section, slug }: { section: ProductSection; slug: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: section.items.map((q) => ({
      "@type": "Question",
      name: q.title,
      acceptedAnswer: { "@type": "Answer", text: q.body },
    })),
  };
  return (
    <div className="pp-faq">
      <div className="pp-faq__side">
        <SectionHead eyebrow={EYEBROW.sss} section={section} />
      </div>
      <div className="pp-faq__list">
        {section.items.map((q) => (
          <details key={q.title} className="pp-faq__item" name={`faq-${slug}`}>
            <summary>
              <span className="pp-faq__q">{q.title}</span>
              <span className="pp-faq__icon" aria-hidden="true" />
            </summary>
            <div className="pp-faq__a"><p>{q.body}</p></div>
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}

function renderSection(section: ProductSection, slug: string, index: number) {
  switch (section.kind) {
    case "ozellikler": return <Features section={section} slug={slug} />;
    case "farklar": return <Differences section={section} />;
    case "nasil-calisir": return <Flow section={section} />;
    case "kullanim-senaryolari":
      return (<><SectionHead eyebrow={EYEBROW["kullanim-senaryolari"]} section={section} /><UseCaseTabs items={section.items} id={`uc-${slug}-${index}`} /></>);
    case "istatistik": return <Capabilities section={section} />;
    case "sss": return <Faq section={section} slug={slug} />;
    default: return <Differences section={section} />;
  }
}

/* ------------------------------------------------------------------ */

function CrossSell({ current }: { current: Product }) {
  return (
    <section className="pp-section pp-section--alt">
      <div className="pp-container">
        <header className="pp-head">
          <p className="pp-label">Ürün ailesi</p>
          <h2 className="pp-h2">Keşfetmeye <span className="pp-grad-text">devam edin</span></h2>
        </header>
        <div className="pp-family">
          {products.map((p) => {
            const [a, b] = ACCENTS[p.slug] ?? ACCENTS["hubai-x"];
            const isCurrent = p.slug === current.slug;
            return (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="pp-family__card"
                aria-current={isCurrent ? "page" : undefined}
                style={{ "--p-accent": a, "--p-accent-2": b } as CSSProperties}
              >
                <span className="pp-family__name">{p.name}</span>
                <span className="pp-family__title">{p.title}</span>
                <span className="pp-family__summary">{p.summary}</span>
                <span className="pp-family__domain">{p.domain}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ProductPage({ product, content }: { product: Product; content: ProductPageContent }) {
  const [accent, accent2] = ACCENTS[product.slug] ?? ACCENTS["hubai-x"];
  const body = content.sections.filter((s) => s.kind !== "cta");

  return (
    <main className="pp" style={{ "--p-accent": accent, "--p-accent-2": accent2 } as CSSProperties}>
      {/* Anasayfadaki "Neler Yapiyoruz" blogu gibi: ortalanmis etiket + baslik + paragraf.
          Breadcrumb ve butonlar yok. */}
      <section className="pp-intro">
        <Ambient />
        <div className="pp-container pp-intro__content">
          <p className="pp-label">{product.title}</p>
          <Heading as="h1" text={content.hero.title} className="pp-h1" />
          <p className="pp-lead">{content.hero.lead}</p>
        </div>
      </section>

      <section className="pp-section pp-section--alt">
        <Blueprint />
        <div className="pp-container">
          <HeroSignature slug={product.slug} />
        </div>
      </section>

      {body.map((section, i) => (
        <section
          key={`${section.kind}-${i}`}
          id={`${section.kind}-${i}`}
          className={`pp-section ${i % 2 === 0 ? "pp-section--light" : "pp-section--alt"}`}
        >
          <div className="pp-container">{renderSection(section, product.slug, i)}</div>
        </section>
      ))}

      <CrossSell current={product} />

      {/* Sade iletisim seridi: tek satir, one cikmayan bir baglanti. */}
      <section className="pp-contact">
        <div className="pp-container pp-contact__inner">
          <p className="pp-contact__text">{product.name} hakkında konuşalım.</p>
          <Link href="/contact" className="pp-contact__link">
            İletişime geçin <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

    </main>
  );
}
