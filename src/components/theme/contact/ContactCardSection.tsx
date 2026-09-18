"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
/* Tema kaynagindan cikarilmis bolum. Harita yukaridaki bolume tasindigi icin
   bu sutunda artik harita degil, iletisim bilgileri duruyor. */
import { contact, YAKINDA } from "@/content/contact";
import content from "./ContactCardSection.content.json";
import "./ContactCardSection.css";

const TASLAK = "ash-contact-draft";

export function ContactCardSection() {
  const [feedback, setFeedback] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  // Onceki taslagi geri yukle. Yazilan taslagin bir karsiligi olsun diye
  // gercekten okunuyor; aksi halde depolama bos yere doluyordu.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    try {
      const ham = localStorage.getItem(TASLAK);
      if (!ham) return;
      const taslak = JSON.parse(ham) as Record<string, string>;
      for (const [ad, deger] of Object.entries(taslak)) {
        const alan = form.elements.namedItem(ad);
        if (alan instanceof HTMLInputElement || alan instanceof HTMLTextAreaElement) alan.value = deger;
      }
    } catch {
      // bozuk ya da erisilemeyen depolama: taslak yok sayilir
    }
  }, []);

  function saveDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      localStorage.setItem(TASLAK, JSON.stringify(Object.fromEntries(data)));
    } catch {
      // depolama kapaliysa taslak saklanamaz; mesaj yine de gonderilmis olmuyor
    }
    setFeedback(
      "Form henüz bir gönderim servisine bağlı değil, bu yüzden mesajınız bize ulaşmadı. " +
        "Yazdıklarınız bu tarayıcıda saklandı; bağlantı kurulduğunda tekrar göndermeniz yeterli olacak.",
    );
  }

  const { office } = contact;

  return (
    <section className="ContactCard_card__OA_Rp">
      <div className="ContactCard_card__content__MO87m">
        <form ref={formRef} onSubmit={saveDraft} className="ContactForm_form__iJjmD">
          <h2 className="ContactForm_form__title__yK8Ml">{content.text_001}</h2>
          <p className="ContactForm_form__description__wqcbd">{content.text_002}</p>
          <div className="ContactForm_form__inputs__tyMmX">
            <label className="Input_input__lvORT">
              <input required autoComplete="name" name="name" className="Input_input__input__IBHLz Input_input__input--light__uMEJL" placeholder=" " type="text" defaultValue="" />
              <span className="Input_placeholder__TiHzN">{content.text_003}</span>
            </label>
            <label className="Input_input__lvORT">
              <input required autoComplete="email" name="email" className="Input_input__input__IBHLz Input_input__input--light__uMEJL" placeholder=" " type="email" />
              <span className="Input_placeholder__TiHzN">{content.text_004}</span>
            </label>
            <label className="Input_input__lvORT">
              <textarea required minLength={5} name="message" className="Input_input__input__IBHLz Input_input__input--light__uMEJL Input_input__input--textarea__21szO" placeholder=" " rows={6}></textarea>
              <span className="Input_placeholder__TiHzN">{content.text_005}</span>
            </label>
          </div>
          <button type="submit" className="Button_button__30ukX Button_button--variant-filled-dark__wXoAl Button_button--radius-large__M_ook">
            <div className="Button_button__children__eLy5L">{content.text_006}</div>
            <div className="Button_button__spinner__HYDVQ"><span></span><span></span><span></span></div>
          </button>
          <p role="status" className="contact-draft-feedback">{feedback}</p>
        </form>

        <div className="CompanyAddress_map__m1jOW">
          <h2 className="CompanyAddress_map__title___vSVw">{content.text_007}</h2>
          <dl className="ash-details">
            <div className="ash-details__row">
              <dt>E-posta</dt>
              <dd>
                {contact.email
                  ? <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  : <span className="ash-details__pending">{YAKINDA}</span>}
              </dd>
            </div>
            <div className="ash-details__row">
              <dt>Telefon</dt>
              <dd>
                {contact.phone
                  ? <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
                  : <span className="ash-details__pending">{YAKINDA}</span>}
              </dd>
            </div>
            <div className="ash-details__row">
              <dt>Adres</dt>
              <dd>
                {office.lines.length
                  ? office.lines.map((line) => <span key={line}>{line}</span>)
                  : <span className="ash-details__pending">{YAKINDA}</span>}
              </dd>
            </div>
            <div className="ash-details__row">
              <dt>Çalışma saatleri</dt>
              <dd>
                {contact.hours ? contact.hours : <span className="ash-details__pending">{YAKINDA}</span>}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
