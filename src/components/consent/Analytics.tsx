"use client";
import { useEffect, useRef } from "react";
import { GA_ID, useConsent } from "./consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Onay geri alininca Google Analytics cerezlerini (_ga, _ga_<kimlik>) siler. */
function deleteGaCookies() {
  const host = location.hostname;
  const root = host.split(".").slice(-2).join(".");
  for (const name of document.cookie.split(";").map((c) => c.split("=")[0].trim()).filter((n) => n.startsWith("_ga"))) {
    for (const domain of ["", `; domain=${host}`, `; domain=.${host}`, `; domain=.${root}`]) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
    }
  }
}

/**
 * Google Analytics 4, yalnizca ziyaretci onay verirse yuklenir: onaydan once
 * Google'a hicbir istek gitmez. Reklam ve kisisellestirme izinleri her
 * durumda kapali. Sayfa gecisleri GA4'un "gelismis olcum" ayari (tarayici
 * gecmisi olaylari) ile kendiliginden sayilir.
 */
export function Analytics() {
  const consent = useConsent();
  const loaded = useRef(false);

  useEffect(() => {
    if (!GA_ID || consent === undefined) return;
    if (consent === "granted") {
      if (loaded.current) {
        window.gtag?.("consent", "update", { analytics_storage: "granted" });
        return;
      }
      loaded.current = true;
      window.dataLayer = window.dataLayer ?? [];
      window.gtag = function gtag() {
        // gtag.js "arguments" nesnesinin kendisini bekler.
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer!.push(arguments);
      };
      window.gtag("consent", "default", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "granted",
      });
      window.gtag("js", new Date());
      window.gtag("config", GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
      document.head.appendChild(script);
    } else {
      if (loaded.current) window.gtag?.("consent", "update", { analytics_storage: "denied" });
      deleteGaCookies();
    }
  }, [consent]);

  return null;
}
