/* Tema kaynagindan cikarilmis bolum; icerik ve fon ASH'e ait. */
import { contact, YAKINDA } from "@/content/contact";
import content from "./HeroSection.content.json";
import "./HeroSection.css";

export function HeroSection() {
  const { office } = contact;
  return (
    <section className="Hero_section__TMXZE">
      {/* Fon: anasayfadaki izometrik ASH gorseli (temanin HubX gorselinin yerine). */}
      <img alt="" src="/images/ash-izometrik.webp" decoding="async" className="Hero_background___6kFe ash-contact-bg" />

      <div className="Hero_section__content__M8xdx">
        <h1 className="Text_text--display-m__q0ZjI Text_text--weight-bold__jl20H">
          <span className="">{content.text_001}</span>
        </h1>
        <p className="Text_text--headline-xl__DqnCT Text_text--weight-bold__jl20H Hero_section__description__kWe2u">
          <span className="Text_text--gradient-gray__zU_Wg">{content.text_002}</span>
        </p>

        {contact.email ? (
          <a className="Hero_section__email__nRmut" href={`mailto:${contact.email}`}>{contact.email}</a>
        ) : (
          <p className="Hero_section__email__nRmut"><span className="ash-pending">E-posta adresi {YAKINDA.toLowerCase()}</span></p>
        )}

        <div className="Hero_section__addresses__IKD8F">
          <div className="Hero_section__addressItem__BDYIn">
            <p className="Text_text--body-l__nT4jd Text_text--weight-bold__jl20H Hero_section__addressSubtitle__9LVos">
              <span className="">{office.title}</span>
            </p>
            <p className="Text_text--body-l__nT4jd Text_text--weight-regular__s9xkg Hero_section__address__mNop5">
              <span className="">{office.lines.length ? office.lines.join(", ") : `Adres ${YAKINDA.toLowerCase()}`}</span>
            </p>
            {office.mapUrl && (
              <div className="Hero_button___EyEn">
                <a className="Hero_button__content__JZq83" target="_blank" rel="noopener noreferrer" href={office.mapUrl}>
                  <span className="Hero_button__text__KiDGP">{content.text_006}</span>
                </a>
              </div>
            )}
          </div>

          <div className="Hero_section__addressItem__BDYIn">
            <p className="Text_text--body-l__nT4jd Text_text--weight-bold__jl20H Hero_section__addressSubtitle__9LVos">
              <span className="">Telefon</span>
            </p>
            <p className="Text_text--body-l__nT4jd Text_text--weight-regular__s9xkg Hero_section__address__mNop5">
              <span className="">
                {contact.phone ? <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a> : `Telefon ${YAKINDA.toLowerCase()}`}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
