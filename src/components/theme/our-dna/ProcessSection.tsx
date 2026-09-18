/* Ilkeler akordeonunun yerini alan surec seridi.
   Bolum basligi temanin InfoSection duzenini aynen kullanir; zaman seridi
   ASH'e ozel cizildi. */
import content from "./ProcessSection.content.json";
import "./ProcessSection.css";

export function ProcessSection() {
  const { example } = content;
  return (
    <section className="Principles_principles__ib_r_">
      <div className="InfoSection_info-section__Z_HgN">
        <div className="InfoSection_info-section__container__YnqlQ">
          <div className="InfoSection_title__vBoLT">
            <p className="InfoSection_title__top-title__Ha4mp">{content.label}</p>
            <h2 className="Text_text--display-m__q0ZjI Text_text--weight-bold__jl20H">
              <span className="">{content.heading}</span>
            </h2>
          </div>
          <div className="InfoSection_content__CuNdq">
            <p>{content.intro1}</p>
            <p>{content.intro2}</p>
          </div>
        </div>
      </div>

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
