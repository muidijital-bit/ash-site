/* Ilkeler akordeonunun yerini alan surec seridi.
   Bolum basligi temanin InfoSection duzenini aynen kullanir; zaman seridi
   ASH'e ozel cizildi. */
import tr from "./ProcessSection.content.json";
import en from "./ProcessSection.content.en.json";
import type { Locale } from "@/i18n/config";
import "./ProcessSection.css";

export function ProcessSection({ locale }: { locale: Locale }) {
  const content = locale === "en" ? en : tr;
  const { example } = content;
  return (
    <section className="Principles_principles__ib_r_">
      {/* Baslik blogu sitenin geri kalaniyla ayni: ortalanmis kucuk gri ust
          etiket, buyuk kalin baslik, ortalanmis genis paragraf. */}
      <header className="ash-flow__head">
        <p className="ash-flow__eyebrow">{content.label}</p>
        <h2 className="Text_text--display-s__xN_wr Text_text--weight-bold__jl20H ash-flow__heading">
          {content.heading}
        </h2>
        <p className="ash-flow__lead">{content.intro1}</p>
        <p className="ash-flow__lead">{content.intro2}</p>
      </header>

      <div className="ash-flow">
        <ol className="ash-flow__list">
          {content.steps.map((step) => (
            <li key={step.no} className="ash-flow__step">
              <div className="ash-flow__rail" aria-hidden="true">
                <span className="ash-flow__node">{step.no}</span>
              </div>
              <h3 className="ash-flow__title">{step.title}</h3>
              <p className="ash-flow__body">{step.body}</p>
            </li>
          ))}
        </ol>

        <aside className="ash-flow__example">
          <p className="ash-flow__example-label">{example.label}</p>
          <div className="ash-flow__example-rows">
            <p className="ash-flow__row ash-flow__row--avoid">
              <span>{example.avoidLabel}</span>
              <q>{example.avoidQuote}</q>
            </p>
            <p className="ash-flow__row ash-flow__row--prefer">
              <span>{example.preferLabel}</span>
              <q>{example.preferQuote}</q>
            </p>
          </div>
          <p className="ash-flow__example-closing">{example.closing}</p>
        </aside>
      </div>
    </section>
  );
}
