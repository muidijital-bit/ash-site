/* Tema kaynagindan cikarilmis bolum; icerik ve fon ASH'e ait. */
import { contact } from "@/content/contact";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import { ContactForm } from "./ContactForm";
import tr from "./HeroSection.content.json";
import en from "./HeroSection.content.en.json";
import "./HeroSection.css";

export function HeroSection({ locale }: { locale: Locale }) {
  const content = locale === "en" ? en : tr;
  const ui = getUi(locale).contact;
  return (
    <section className="Hero_section__TMXZE">
      {/* Masaustunde form solda, baslik sagda, ofisler ikisinin altinda. Dar
          ekranda once baslik, sonra form, en son ofisler gelir (sira CSS'te). */}
      <div className="Hero_section__content__M8xdx ash-contact-hero">
        {/* Anasayfadaki izometrik ASH gorseli (temanin HubX gorselinin yerine).
            Dar ekranda soluk fon; masaustunde basligin altindaki bosluga oturur. */}
        <Image alt="" src="/images/ash-izometrik.webp" width={1398} height={1125} sizes="(min-width: 64rem) 26rem, (min-width: 48rem) 58vw, 72vw" loading="eager" className="Hero_background___6kFe ash-contact-bg" />

        <div className="ash-contact-hero__intro">
          <h1 className="Text_text--display-m__q0ZjI Text_text--weight-bold__jl20H">
            <span className="">{content.text_001}</span>
          </h1>
          <p className="Text_text--headline-xl__DqnCT Text_text--weight-bold__jl20H Hero_section__description__kWe2u">
            <span className="Text_text--gradient-gray__zU_Wg">{content.text_002}</span>
          </p>

          {contact.email && (
            <a className="Hero_section__email__nRmut" href={`mailto:${contact.email}`}>{contact.email}</a>
          )}
        </div>

        <ContactForm locale={locale} />

        {/* Ofisler genis ekranda yan yana, mobilde alt alta listelenir. */}
        <div className="Hero_section__addresses__IKD8F ash-contact-hero__offices">
          {contact.offices.filter((office) => office.lines.length > 0).map((office) => (
            <div key={office.id} className="Hero_section__addressItem__BDYIn">
              <p className="Text_text--body-l__nT4jd Text_text--weight-bold__jl20H Hero_section__addressSubtitle__9LVos">
                <span className="">{office.name[locale]}</span>
              </p>
              {/* Her satir kendi satirinda: tek dizeye birlestirilince
                  "34340 Besiktas, / Istanbul" gibi ortasindan bolunuyordu. */}
              <p className="Text_text--body-l__nT4jd Text_text--weight-regular__s9xkg Hero_section__address__mNop5">
                {office.lines.map((line) => <span key={line} className="ash-address__line">{line}</span>)}
              </p>
              {office.mapUrl && (
                <div className="Hero_button___EyEn">
                  <a className="Hero_button__content__JZq83" target="_blank" rel="noopener noreferrer" href={office.mapUrl}>
                    <span className="Hero_button__text__KiDGP">{content.text_006}</span>
                  </a>
                </div>
              )}
            </div>
          ))}

          {contact.phone && (
            <div className="Hero_section__addressItem__BDYIn">
              <p className="Text_text--body-l__nT4jd Text_text--weight-bold__jl20H Hero_section__addressSubtitle__9LVos">
                <span className="">{ui.phone}</span>
              </p>
              <p className="Text_text--body-l__nT4jd Text_text--weight-regular__s9xkg Hero_section__address__mNop5">
                <span className=""><a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a></span>
              </p>
            </div>
          )}

          {contact.hours && (
            <div className="Hero_section__addressItem__BDYIn">
              <p className="Text_text--body-l__nT4jd Text_text--weight-bold__jl20H Hero_section__addressSubtitle__9LVos">
                <span className="">{ui.hours}</span>
              </p>
              <p className="Text_text--body-l__nT4jd Text_text--weight-regular__s9xkg Hero_section__address__mNop5">
                <span className="">{contact.hours}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
