import { localizedSlug, type Locale } from "@/i18n/config";
import type { LegalDoc } from "./types";

import gizlilik_politikasi from "./gizlilik-politikasi.json";
import kvkk_aydinlatma_metni from "./kvkk-aydinlatma-metni.json";
import cerez_politikasi from "./cerez-politikasi.json";
import gizlilik_politikasi_en from "./en/gizlilik-politikasi.json";
import kvkk_aydinlatma_metni_en from "./en/kvkk-aydinlatma-metni.json";
import cerez_politikasi_en from "./en/cerez-politikasi.json";

/** Yasal metinler. Ingilizceleri ayni dosya adiyla en/ klasorunde, Ingilizce slug'la durur. */
const docsByLocale: Record<Locale, LegalDoc[]> = {
  tr: [gizlilik_politikasi, kvkk_aydinlatma_metni, cerez_politikasi],
  en: [gizlilik_politikasi_en, kvkk_aydinlatma_metni_en, cerez_politikasi_en],
};

/** Metin + dil bagimsiz anahtari (Turkce slug). */
export type LocalizedLegalDoc = LegalDoc & { key: string };

function withKeys(locale: Locale): LocalizedLegalDoc[] {
  return docsByLocale[locale].map((doc, i) => {
    const key = docsByLocale.tr[i].slug;
    // Adres tablosu (src/i18n/config.ts) ile dosyadaki slug ayni olmali; degilse derleme durur.
    if (doc.slug !== localizedSlug("legal", key, locale)) {
      throw new Error(`Yasal metin slug uyumsuz: ${locale}/${doc.slug} (beklenen ${localizedSlug("legal", key, locale)})`);
    }
    return { ...doc, key };
  });
}

const localized: Record<Locale, LocalizedLegalDoc[]> = { tr: withKeys("tr"), en: withKeys("en") };

export function getLegalDocs(locale: Locale): LocalizedLegalDoc[] {
  return localized[locale];
}

/** Adresteki (o dilin) slug'iyla metin. */
export function getLegalDoc(locale: Locale, slug: string): LocalizedLegalDoc | undefined {
  return localized[locale].find((d) => d.slug === slug);
}
