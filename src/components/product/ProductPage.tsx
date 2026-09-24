import Link from "next/link";
import type { CSSProperties } from "react";
import { getProducts, type Product } from "@/content/products";
import { SHOW_PRODUCT_DOMAINS } from "@/content/site";
import { localePath, type Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import { getProductMedia } from "./media";
import { ProductMedia } from "./ProductMedia";
import type { ProductPageContent, ProductSection, SectionItem } from "./types";
import { UseCaseTabs } from "./UseCaseTabs";
import { Ambient, Blueprint, Crosshair, FeatureMock, HeroSignature } from "./visuals";
import "./product.css";
import { ProductName, ProductEyebrow } from "@/components/theme/shared/ProductName";
import { jsonLdString } from "@/lib/seo";

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

/* ------------------------------------------------------------------ */

/** Icerikte hazir demo tanimliysa onu, yoksa bolumun cizim mockup'ini gosterir. */
function FeatureVisual({ item, slug, variant, locale }: { item: SectionItem; slug: string; variant: number; locale: Locale }) {
  const media = getProductMedia(item.media);
  return media ? <ProductMedia media={media} locale={locale} /> : <FeatureMock slug={slug} variant={variant} locale={locale} />;
}

function Features({ section, slug, eyebrow, locale }: { section: ProductSection; slug: string; eyebrow: string; locale: Locale }) {
  return (
    <>
      <SectionHead eyebrow={eyebrow} section={section} />
      <div className="pp-zigzag">
        {section.items.map((item, i) => (
          <article key={item.title} className="pp-zig" data-flip={i % 2 ? "" : undefined}>
            <div className="pp-zig__text">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
            <div className="pp-zig__visual"><FeatureVisual item={item} slug={slug} variant={i} locale={locale} /></div>
          </article>
        ))}
      </div>
    </>
  );
}

function Differences({ section, eyebrow }: { section: ProductSection; eyebrow: string }) {
  return (
    <>
      <SectionHead eyebrow={eyebrow} section={section} />
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

function Flow({ section, eyebrow }: { section: ProductSection; eyebrow: string }) {
  return (
    <>
      <SectionHead eyebrow={eyebrow} section={section} />
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

/** Halkanin cevresi (2 * pi * 38). Yuzde iceren degerde yay o orana kadar dolar. */
const DIAL = 239;

function dialOffset(value: string): CSSProperties | undefined {
  const pct = Number(value.match(/%\s*(\d+)|(\d+)\s*%/)?.slice(1).find(Boolean));
  return Number.isFinite(pct) ? { strokeDashoffset: DIAL * (1 - pct / 100) } : undefined;
}

function Capabilities({ section, eyebrow }: { section: ProductSection; eyebrow: string }) {
  return (
    <>
      <SectionHead eyebrow={eyebrow} section={section} />
      <div className="pp-band">
        {section.items.map((item) => (
          <div key={item.title} className="pp-band__cell">
            <svg className="pp-dial" viewBox="0 0 88 88" aria-hidden="true">
              <circle cx="44" cy="44" r="38" className="pp-dial__track" />
              <circle cx="44" cy="44" r="38" className="pp-dial__arc" style={dialOffset(item.title)} />
            </svg>
            <strong>{item.title}</strong>
            <p>{item.body}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function Faq({ section, slug, eyebrow }: { section: ProductSection; slug: string; eyebrow: string }) {
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
        <SectionHead eyebrow={eyebrow} section={section} />
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
    </div>
  );
}

function renderSection(section: ProductSection, slug: string, index: number, locale: Locale) {
  const { eyebrow, useCaseLabel } = getUi(locale).product;
  // Icerik kendi ust etiketini verebilir; vermezse bolum turunun etiketi.
  const etiket = (varsayilan: string) => section.eyebrow || varsayilan;
  switch (section.kind) {
    case "ozellikler": return <Features section={section} slug={slug} eyebrow={etiket(eyebrow.ozellikler)} locale={locale} />;
    case "farklar": return <Differences section={section} eyebrow={etiket(eyebrow.farklar)} />;
    case "nasil-calisir": return <Flow section={section} eyebrow={etiket(eyebrow["nasil-calisir"])} />;
    case "kullanim-senaryolari":
      return (<><SectionHead eyebrow={etiket(eyebrow["kullanim-senaryolari"])} section={section} /><UseCaseTabs items={section.items} id={`uc-${slug}-${index}`} label={useCaseLabel} /></>);
    case "istatistik": return <Capabilities section={section} eyebrow={etiket(eyebrow.istatistik)} />;
    case "sss": return <Faq section={section} slug={slug} eyebrow={etiket(eyebrow.sss)} />;
    default: return <Differences section={section} eyebrow={etiket(eyebrow.farklar)} />;
  }
}

/* ------------------------------------------------------------------ */

function CrossSell({ current, locale }: { current: Product; locale: Locale }) {
  const { familyLabel, familyTitle } = getUi(locale).product;
  return (
    <section className="pp-section pp-section--alt">
      <div className="pp-container">
        <header className="pp-head">
          <p className="pp-label">{familyLabel}</p>
          <h2 className="pp-h2">{familyTitle[0]}<span className="pp-grad-text">{familyTitle[1]}</span></h2>
        </header>
        <div className="pp-family">
          {getProducts(locale).map((p) => {
            const [a, b] = p.accent;
            const isCurrent = p.slug === current.slug;
            return (
              <Link
                key={p.slug}
                href={localePath(locale, `/products/${p.slug}`)}
                className="pp-family__card"
                aria-current={isCurrent ? "page" : undefined}
                style={{ "--p-accent": a, "--p-accent-2": b } as CSSProperties}
              >
                <span className="pp-family__name"><ProductName name={p.name} /></span>
                <span className="pp-family__title">{p.title}</span>
                <span className="pp-family__summary">{p.summary}</span>
                {SHOW_PRODUCT_DOMAINS && <span className="pp-family__domain">{p.domain}</span>}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ProductPage({ product, content, locale }: { product: Product; content: ProductPageContent; locale: Locale }) {
  const ui = getUi(locale);
  const [accent, accent2] = product.accent;
  const [heroLead, heroAccent] = splitAccent(content.hero.title);
  const heroMedia = getProductMedia(content.hero.media);
  const body = content.sections.filter((s) => s.kind !== "cta");

  // pp--bands: bolumler beyaz/acik gri sirayla (anasayfadaki serit duzeni).
  return (
    <main className="pp pp--bands" style={{ "--p-accent": accent, "--p-accent-2": accent2 } as CSSProperties}>
      {/* Anasayfadaki "Neler Yapiyoruz" blogu gibi: ortalanmis etiket + baslik + paragraf.
          Breadcrumb ve butonlar yok. */}
      <section className={`pp-intro${content.hero.feature ? " pp-intro--featured" : ""}`}>
        <Ambient />
        <div className="pp-container pp-intro__content">
          {/* Urun adi basligin ilk satiri: gorunum aynidir ama marka adi h1'in
              icinde gecer (arama motorlari ve ekran okuyucular icin). */}
          <h1 className="pp-hero-title">
            <span className="pp-hero-title__eyebrow">
              <ProductEyebrow text={content.hero.eyebrow || `${product.name} · ${product.title}`} />
            </span>
            {/* Blok ogeler ekranda ayri satirda; metin olarak okununca ("SAP YAPAY ZEKÂSAP
                Uzmanligini") yapismasin diye aralarinda bosluk birakilir. */}
            {" "}
            <span className="pp-hero-title__main">
              {heroLead}<span className="pp-grad-text">{heroAccent}</span>
            </span>
          </h1>
          <p className="pp-lead">{content.hero.lead}</p>
        </div>
        {content.hero.feature && (
          <div className="pp-container">
            <article className="pp-zig pp-intro-feature" aria-labelledby="hero-feature-title">
              <div className="pp-zig__text">
                <h2 id="hero-feature-title" className="pp-intro-feature__title">{content.hero.feature.title}</h2>
                <p>{content.hero.feature.body}</p>
              </div>
              <div className="pp-zig__visual">
                <FeatureVisual item={content.hero.feature} slug={product.slug} variant={0} locale={locale} />
              </div>
            </article>
          </div>
        )}
      </section>

      <section className="pp-section pp-section--alt">
        <Blueprint />
        <div className="pp-container">
          {heroMedia
            ? <ProductMedia media={heroMedia} locale={locale} className="pp-media--hero" sizes="(min-width: 68rem) 1024px, calc(100vw - 48px)" />
            : <HeroSignature slug={product.slug} locale={locale} />}
        </div>
      </section>

      {body.map((section, i) => (
        <section
          key={`${section.kind}-${i}`}
          id={`${section.kind}-${i}`}
          className={`pp-section ${i % 2 === 0 ? "pp-section--light" : "pp-section--alt"}`}
        >
          <div className="pp-container">{renderSection(section, product.slug, i, locale)}</div>
        </section>
      ))}

      <CrossSell current={product} locale={locale} />

      {/* Sade iletisim seridi: tek satir, one cikmayan bir baglanti. */}
      <section className="pp-contact">
        <div className="pp-container pp-contact__inner">
          <p className="pp-contact__text">{ui.product.talkAbout(product.name)}</p>
          <Link href={localePath(locale, "/contact")} className="pp-contact__link">
            {ui.getInTouch} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

    </main>
  );
}
