/* Browser-extracted source design; editable copy/assets live beside this component. */
import Link from "next/link";
import type { CSSProperties } from "react";
import tr from "./HowWeWorkSection.content.json";
import en from "./HowWeWorkSection.content.en.json";
import { getProducts } from "@/content/products";
import { localePath, type Locale } from "@/i18n/config";
import { FlowDiagram, InputsDiagram, LoadDiagram } from "./HowWeWorkVisuals";
import "./HowWeWorkSection.css";
import { ProductName } from "@/components/theme/shared/ProductName";

/**
 * Baslik ve giris paragrafi temanin kendi duzeninde kaliyor.
 * Altindaki bolum bir bento izgarasi: uc yetkinlik karti + urun ailesi.
 * Gorseller kod ile cizildi (HowWeWorkVisuals), stok gorsel yok.
 */
export function HowWeWorkSection({ locale }: { locale: Locale }) {
  const content = locale === "en" ? en : tr;
  return (<>
    <section className="HowWeWork_how-we-work__zclk_"><div className="HowWeWork_how-we-work__container___rW1K"><div className="HowWeWork_how-we-work__content__72VcT HowWeWork_how-we-work__content--show__MMxSU"><h2 className="Text_text--display-s__xN_wr Text_text--weight-bold__jl20H HowWeWork_how-we-work__title__cvkhc"><span className="">{content.text_001}</span>{" "}<span className="ash-grad-text">{content.text_001_accent}</span></h2><p className="Text_text--headline-m__C9G6u Text_text--weight-medium__uNX0v HowWeWork_how-we-work__subtitle__0YDn0"><span className="">{content.text_002}</span></p></div>

      <div className="ash-bento">
        {/* Genis kart: surecin nerede tikandigini bilmek. */}
        <article className="ash-bento__card ash-bento__card--wide">
          <h3 className="ash-bento__title">{content.text_007}{content.text_008}</h3>
          <p className="ash-bento__body">{content.text_009}</p>
          <div className="ash-bento__visual">
            <FlowDiagram steps={content.flow} note={content.flowNote} />
          </div>
        </article>

        <article className="ash-bento__card">
          <h3 className="ash-bento__title">{content.text_010}</h3>
          <p className="ash-bento__body">{content.text_011}</p>
          <div className="ash-bento__visual">
            <InputsDiagram inputs={content.inputs} out={content.inputsOut} />
          </div>
        </article>

        <article className="ash-bento__card">
          <h3 className="ash-bento__title">{content.text_012}</h3>
          <p className="ash-bento__body">{content.text_013}</p>
          <div className="ash-bento__visual">
            <LoadDiagram pilot={content.loadPilot} prod={content.loadProd} />
          </div>
        </article>

        {/* Genis kart: urun ailesi, her urun kendi marka renginde. */}
        <article className="ash-bento__card ash-bento__card--wide ash-bento__card--family">
          <h3 className="ash-bento__title">{content.familyTitle}</h3>
          <p className="ash-bento__body">{content.familyBody}</p>
          <ul className="ash-bento__pills">
            {getProducts(locale).map((p) => (
              <li key={p.slug} className="ash-bento__pill" style={{ "--urun-renk": p.accent[0] } as CSSProperties}>
                <span className="ash-bento__pill-name"><ProductName name={p.name} /></span>
                <span className="ash-bento__pill-title">{p.title}</span>
              </li>
            ))}
          </ul>
          <Link className="ash-bento__link" href={localePath(locale, "/products")}>
            {content.familyLink} <span aria-hidden="true">→</span>
          </Link>
        </article>
      </div>
    </div></section>
  </>);
}
