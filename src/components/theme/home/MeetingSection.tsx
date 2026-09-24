import Link from "next/link";
import { contact } from "@/content/contact";
import { localePath, type Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import tr from "./MeetingSection.content.json";
import en from "./MeetingSection.content.en.json";
import "./MeetingSection.css";

/**
 * Anasayfada blogun ustundeki toplanti bolumu: kisa baslik ve altinda
 * Google Takvim randevu ekrani, Google'in kendi gomme gorunumuyle (cerceve,
 * golge, arka plan tasarimi yok). Cerceve loading="lazy": ziyaretci bolume
 * yaklasmadan Google'a istek gitmez; cerez ve gizlilik metinleri buna gore.
 * Randevu adresi tanimli degilse bolum hic gosterilmez.
 */
export function MeetingSection({ locale }: { locale: Locale }) {
  if (!contact.meetingUrl) return null;
  const content = locale === "en" ? en : tr;
  const ui = getUi(locale).contact;
  return (
    <section className="ash-meet" aria-labelledby="ash-meet-title">
      <div className="ash-meet__inner">
        <header className="ash-meet__head">
          <p className="ash-meet__eyebrow">{content.eyebrow}</p>
          <h2 id="ash-meet-title" className="ash-meet__title">
            {content.title} <span className="ash-grad-text">{content.titleAccent}</span>
          </h2>
          <p className="ash-meet__lead">{content.lead}</p>
        </header>
        <iframe className="ash-meet__frame" src={contact.meetingUrl} title={ui.bookMeeting} loading="lazy" />
        <p className="ash-meet__foot">
          <a href={contact.meetingUrl} target="_blank" rel="noopener noreferrer">{ui.meetingNewTab}</a>
          <span aria-hidden="true"> · </span>
          <Link href={localePath(locale, "/contact")}>{content.write}</Link>
        </p>
      </div>
    </section>
  );
}
