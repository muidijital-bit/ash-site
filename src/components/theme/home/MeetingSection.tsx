import Link from "next/link";
import { contact } from "@/content/contact";
import { localePath, type Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import tr from "./MeetingSection.content.json";
import en from "./MeetingSection.content.en.json";
import "./MeetingSection.css";

/**
 * Anasayfada blogun ustundeki toplanti karti: solda davet, sagda dogrudan
 * Google Takvim randevu ekrani (gomulu). Cerceve loading="lazy": ziyaretci
 * bolume yaklasmadan Google'a istek gitmez. Cerez ve gizlilik metinleri bu
 * davranisi anlatir. Randevu adresi tanimli degilse bolum hic gosterilmez.
 */
export function MeetingSection({ locale }: { locale: Locale }) {
  if (!contact.meetingUrl) return null;
  const content = locale === "en" ? en : tr;
  const ui = getUi(locale).contact;
  return (
    <section className="ash-meet" aria-labelledby="ash-meet-title">
      <div className="ash-meet__card">
        <div className="ash-meet__text">
          <p className="ash-meet__eyebrow">{content.eyebrow}</p>
          <h2 id="ash-meet-title" className="ash-meet__title">
            {content.title} <span className="ash-grad-text">{content.titleAccent}</span>
          </h2>
          <p className="ash-meet__lead">{content.lead}</p>
          <ul className="ash-meet__points">
            {content.points.map((point) => <li key={point}>{point}</li>)}
          </ul>
          <div className="ash-meet__actions">
            <Link className="ash-meet__write" href={localePath(locale, "/contact")}>
              {content.write} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="ash-meet__calendar">
          <iframe className="ash-meet__frame" src={contact.meetingUrl} title={ui.bookMeeting} loading="lazy" />
          <a className="ash-meet__newtab" href={contact.meetingUrl} target="_blank" rel="noopener noreferrer">{ui.meetingNewTab}</a>
        </div>
      </div>
    </section>
  );
}
