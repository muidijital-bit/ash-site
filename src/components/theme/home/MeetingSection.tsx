import Link from "next/link";
import { contact } from "@/content/contact";
import { localePath, type Locale } from "@/i18n/config";
import { MeetingButton } from "@/components/theme/shared/MeetingButton";
import tr from "./MeetingSection.content.json";
import en from "./MeetingSection.content.en.json";
import "./MeetingSection.css";

/* Takvim kartindaki ornek saatler; [sutun, satir] secili gorunur. Suslemedir. */
const SLOTS = [
  ["09:00", "10:30", "14:00"],
  ["09:45", "11:15", "15:30"],
  ["10:00", "13:30", "16:15"],
];
const PICKED = [1, 1];

/**
 * Anasayfada blogun ustundeki toplanti karti. Buton Google Takvim randevu
 * sayfasini site icinde bir pencerede acar (MeetingButton); randevu adresi
 * tanimli degilse bolum hic gosterilmez.
 */
export function MeetingSection({ locale }: { locale: Locale }) {
  if (!contact.meetingUrl) return null;
  const content = locale === "en" ? en : tr;
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
            <MeetingButton locale={locale} />
            <Link className="ash-meet__write" href={localePath(locale, "/contact")}>
              {content.write} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Randevu ekranini anlatan cizim; ekran okuyuculara gosterilmez. */}
        <div className="ash-meet__visual" aria-hidden="true">
          <div className="ash-meet__cal">
            <p className="ash-meet__cal-title">{content.calTitle}</p>
            <div className="ash-meet__cal-grid">
              {content.days.map((day, col) => (
                <div key={day} className="ash-meet__cal-col">
                  <span className="ash-meet__cal-day">{day}</span>
                  {SLOTS[col].map((time, row) => {
                    const picked = col === PICKED[0] && row === PICKED[1];
                    return (
                      <span key={time} className={`ash-meet__slot${picked ? " is-picked" : ""}`}>{time}</span>
                    );
                  })}
                </div>
              ))}
            </div>
            <p className="ash-meet__cal-foot"><i />{content.calFoot}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
