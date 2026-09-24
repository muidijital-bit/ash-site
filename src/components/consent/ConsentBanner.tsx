"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { localePath, type Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import { GA_ID, onConsentBannerOpen, openConsentBanner, useConsent, writeConsent } from "./consent";
import "./ConsentBanner.css";

/**
 * Cerez onay seridi. "Kabul et" ve "Reddet" ayni gorunumde ve ayni agirlikta:
 * reddetmek kabul etmek kadar kolay olmali. Secim yapilana kadar ya da
 * footer'daki "Cerez tercihleri" ile yeniden acilinca gorunur.
 */
export function ConsentBanner({ locale }: { locale: Locale }) {
  const ui = getUi(locale).consent;
  const consent = useConsent();
  const [reopened, setReopened] = useState(false);

  useEffect(() => onConsentBannerOpen(() => setReopened(true)), []);

  if (!GA_ID || consent === undefined || (consent !== null && !reopened)) return null;
  const choose = (choice: "granted" | "denied") => {
    writeConsent(choice);
    setReopened(false);
  };
  return (
    <section className="ash-consent" aria-label={ui.label}>
      <p className="ash-consent__text">
        {ui.text}{" "}
        <Link href={localePath(locale, "/legal/cerez-politikasi")}>{ui.policy}</Link>
      </p>
      <div className="ash-consent__actions">
        <button type="button" className="ash-consent__button" onClick={() => choose("denied")}>{ui.reject}</button>
        <button type="button" className="ash-consent__button" onClick={() => choose("granted")}>{ui.accept}</button>
      </div>
    </section>
  );
}

/** Footer'daki "Cerez tercihleri" baglantisi; analitik kurulu degilse gorunmez. */
export function ConsentPreferencesLink({ locale, className }: { locale: Locale; className?: string }) {
  if (!GA_ID) return null;
  return (
    <button type="button" className={`ash-consent-link ${className ?? ""}`} onClick={openConsentBanner}>
      {getUi(locale).consent.preferences}
    </button>
  );
}
