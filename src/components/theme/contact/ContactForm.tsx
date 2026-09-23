"use client";
import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
/* Tema kaynagindan cikarilmis form. Hero'nun sol sutununda beyaz kart olarak
   durur; iletisim bilgileri hero'nun sag sutununda. */
import Link from "next/link";
import { sendContactMessage, type ContactResult } from "@/app/[lang]/contact/actions";
import { contact } from "@/content/contact";
import { localePath, type Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import tr from "./ContactForm.content.json";
import en from "./ContactForm.content.en.json";
import "./ContactForm.css";

const TASLAK = "ash-contact-draft";
const TASLAK_ALANLARI = ["name", "email", "phone", "message"];

function saveDraft(data: FormData) {
  try {
    const taslak = Object.fromEntries(TASLAK_ALANLARI.map((ad) => [ad, String(data.get(ad) ?? "")]));
    localStorage.setItem(TASLAK, JSON.stringify(taslak));
  } catch {
    // depolama kapaliysa taslak saklanamaz; form alanlari yine de dolu kalir
  }
}

export function ContactForm({ locale }: { locale: Locale }) {
  const content = locale === "en" ? en : tr;
  const ui = getUi(locale).contact;
  const [result, setResult] = useState<ContactResult | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  // Gonderilemeyen bir mesajin taslagi varsa geri yukle.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    try {
      const ham = localStorage.getItem(TASLAK);
      if (!ham) return;
      const taslak = JSON.parse(ham) as Record<string, string>;
      for (const ad of TASLAK_ALANLARI) {
        const alan = form.elements.namedItem(ad);
        if ((alan instanceof HTMLInputElement || alan instanceof HTMLTextAreaElement) && typeof taslak[ad] === "string") alan.value = taslak[ad];
      }
    } catch {
      // bozuk ya da erisilemeyen depolama: taslak yok sayilir
    }
  }, []);

  // Form eylemi (action) yerine onSubmit: React form eylemi bittikten sonra
  // alanlari temizler, gonderim basarisiz olunca yazilanlar kaybolurdu.
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    startTransition(async () => {
      let sonuc: ContactResult;
      try {
        sonuc = await sendContactMessage(data);
      } catch {
        // ag hatasi ya da yeni yayin sonrasi eski sayfadan gelen istek
        sonuc = "failed";
      }
      if (sonuc === "sent") {
        form.reset();
        try { localStorage.removeItem(TASLAK); } catch { /* depolama kapali */ }
      } else if (sonuc === "failed") {
        saveDraft(data);
      }
      setResult(sonuc);
    });
  }

  const durum = result && !pending ? result : null;

  return (
    <form ref={formRef} onSubmit={submit} className="ContactForm_form__iJjmD ash-contact-form">
      <h2 className="ContactForm_form__title__yK8Ml">{content.text_001}</h2>
      <p className="ContactForm_form__description__wqcbd">{content.text_002}</p>
      <input type="hidden" name="locale" value={locale} />
      {/* Botlar icin tuzak: ekranda ve klavye sirasinda yok. */}
      <label className="ash-contact-form__trap" aria-hidden="true">
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
      <div className="ContactForm_form__inputs__tyMmX">
        <label className="Input_input__lvORT">
          <input required minLength={2} maxLength={120} autoComplete="name" name="name" className="Input_input__input__IBHLz Input_input__input--light__uMEJL" placeholder=" " type="text" defaultValue="" />
          <span className="Input_placeholder__TiHzN">{content.text_003}</span>
        </label>
        <label className="Input_input__lvORT">
          <input required maxLength={254} autoComplete="email" name="email" className="Input_input__input__IBHLz Input_input__input--light__uMEJL" placeholder=" " type="email" />
          <span className="Input_placeholder__TiHzN">{content.text_004}</span>
        </label>
        <label className="Input_input__lvORT">
          <input maxLength={40} autoComplete="tel" name="phone" className="Input_input__input__IBHLz Input_input__input--light__uMEJL" placeholder=" " type="tel" />
          <span className="Input_placeholder__TiHzN">{content.text_008}</span>
        </label>
        <label className="Input_input__lvORT">
          <textarea required minLength={5} maxLength={5000} name="message" className="Input_input__input__IBHLz Input_input__input--light__uMEJL Input_input__input--textarea__21szO" placeholder=" " rows={6}></textarea>
          <span className="Input_placeholder__TiHzN">{content.text_005}</span>
        </label>
      </div>
      <button type="submit" disabled={pending} aria-busy={pending} className={`Button_button__30ukX Button_button--variant-colorful-dark__CCVPh Button_button--radius-large__M_ook${pending ? " Button_button--disabled__Cw0Va" : ""}`}>
        <div className={`Button_button__children__eLy5L${pending ? " Button_button__children--loading__tkUAS" : ""}`}>{content.text_006}</div>
        <div className={`Button_button__spinner__HYDVQ${pending ? " Button_button__spinner--loading__m7e3t" : ""}`}><span></span><span></span><span></span></div>
      </button>
      <p role="status" className={`contact-draft-feedback${durum ? ` contact-draft-feedback--${durum}` : ""}`}>
        {durum && ui[durum]}
        {durum === "failed" && contact.email && <> <a href={`mailto:${contact.email}`}>{contact.email}</a></>}
      </p>
      <p className="ash-contact-form__privacy">
        {ui.privacy[0]}
        <Link href={localePath(locale, "/legal/kvkk-aydinlatma-metni")}>{ui.privacy[1]}</Link>
        {ui.privacy[2]}
      </p>
    </form>
  );
}
