import tr from "./ProcessSection.content.json";
import en from "./ProcessSection.content.en.json";
import type { Locale } from "@/i18n/config";
import "./ProcessSection.css";

/**
 * "Nasil ilerliyoruz" seridi: kesiften uretime bes adim.
 * Blog seridinin ustunde durur; basliklar h2 > h3 sirasini korur.
 *
 * Baslik blogu anasayfadaki diger bolumlerle ayni tipografiyi kullanir:
 * ust etiket + kalin baslik + aciklama, temanin Text_text--* adimlariyla.
 */
export function ProcessSection({ locale }: { locale: Locale }) {
  const content = locale === "en" ? en : tr;
  return (
    <section className="ash-process" aria-labelledby="nasil-ilerliyoruz">
      <div className="ash-process__inner">
        <header className="ash-process__head">
          <p className="ash-process__eyebrow">{content.eyebrow}</p>
          <h2
            className="Text_text--display-s__xN_wr Text_text--weight-bold__jl20H ash-process__title"
            id="nasil-ilerliyoruz"
          >
            {content.title}{" "}
            <span className="ash-grad-text">{content.titleAccent}</span>
          </h2>
          <p className="Text_text--headline-m__C9G6u Text_text--weight-medium__uNX0v ash-process__lead">
            {content.lead}
          </p>
        </header>
        <ol className="ash-process__steps">
          {content.steps.map((step, i) => (
            <li key={step.title} className="ash-process__step">
              <span className="ash-process__node" aria-hidden="true">{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
