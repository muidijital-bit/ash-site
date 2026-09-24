"use client";
import { useSyncExternalStore } from "react";

/**
 * Cerez onayi (yalnizca analitik icin; reklam cerezi hic kullanilmiyor).
 * Google Analytics olcum kimligi tanimli degilse (NEXT_PUBLIC_GA_ID) onay
 * seridi de, analitik de hic calismaz. Secim tarayicida saklanir; cerez
 * politikasinda "Cerez tercihinizin kaydedilmesi" olarak anlatiliyor.
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

export type ConsentChoice = "granted" | "denied";

const KEY = "ash-consent-v1";
const CHANGE = "ash-consent-change";
const OPEN = "ash-consent-open";

export function readConsent(): ConsentChoice | null {
  try {
    const value = (JSON.parse(localStorage.getItem(KEY) ?? "null") as { analytics?: unknown } | null)?.analytics;
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function writeConsent(choice: ConsentChoice) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ analytics: choice, at: new Date().toISOString() }));
  } catch {
    // depolama kapaliysa secim bu sayfa icin gecerli olur
  }
  window.dispatchEvent(new Event(CHANGE));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Sunucuda "undefined" (bilinmiyor); tarayicida kayitli secim ya da null. */
export function useConsent(): ConsentChoice | null | undefined {
  return useSyncExternalStore(subscribe, readConsent, () => undefined);
}

/** Footer'daki "Cerez tercihleri" seridi yeniden acar. */
export function openConsentBanner() {
  window.dispatchEvent(new Event(OPEN));
}
export function onConsentBannerOpen(handler: () => void) {
  window.addEventListener(OPEN, handler);
  return () => window.removeEventListener(OPEN, handler);
}
