import "server-only";
import { getPublishedRows } from "@/lib/cms/public";
import { localizedSlug, type Locale } from "@/i18n/config";
import type { BlogPost } from "./types";

import crm_yapay_zeka_satis_otomasyonu from "./crm-yapay-zeka-satis-otomasyonu.json";
import golge_ai_kurumsal_yapay_zeka from "./golge-ai-kurumsal-yapay-zeka.json";
import sap_yapay_zeka_abap_gelistirme from "./sap-yapay-zeka-abap-gelistirme.json";
import masraf_yonetimi_neden_tikanir from "./masraf-yonetimi-neden-tikanir.json";
import crm_yapay_zeka_satis_otomasyonu_en from "./en/crm-yapay-zeka-satis-otomasyonu.json";
import golge_ai_kurumsal_yapay_zeka_en from "./en/golge-ai-kurumsal-yapay-zeka.json";
import sap_yapay_zeka_abap_gelistirme_en from "./en/sap-yapay-zeka-abap-gelistirme.json";
import masraf_yonetimi_neden_tikanir_en from "./en/masraf-yonetimi-neden-tikanir.json";

/**
 * Yayin tarihine gore yeniden eskiye siralanmis blog yazilari.
 * Ingilizce yazilar ayni dosya adiyla en/ klasorunde, Ingilizce slug'la durur;
 * iki listenin sirasi aynidir.
 */
const postsByLocale: Record<Locale, BlogPost[]> = {
  tr: [
    crm_yapay_zeka_satis_otomasyonu,
    golge_ai_kurumsal_yapay_zeka,
    sap_yapay_zeka_abap_gelistirme,
    masraf_yonetimi_neden_tikanir,
  ],
  en: [
    crm_yapay_zeka_satis_otomasyonu_en,
    golge_ai_kurumsal_yapay_zeka_en,
    sap_yapay_zeka_abap_gelistirme_en,
    masraf_yonetimi_neden_tikanir_en,
  ],
};

/** Yazi + dil bagimsiz anahtari (Turkce slug). Baglantilar anahtarla kurulur, localePath dile cevirir. */
export type LocalizedPost = BlogPost & { key: string; translations?: Partial<Record<Locale, string>>; updatedAt?: string };

function withKeys(locale: Locale): LocalizedPost[] {
  return postsByLocale[locale].map((post, i) => {
    const key = postsByLocale.tr[i].slug;
    // Adres tablosu (src/i18n/config.ts) ile dosyadaki slug ayni olmali; degilse derleme durur.
    if (post.slug !== localizedSlug("blog", key, locale)) {
      throw new Error(`Blog slug uyumsuz: ${locale}/${post.slug} (beklenen ${localizedSlug("blog", key, locale)})`);
    }
    return { ...post, key };
  });
}

const localized: Record<Locale, LocalizedPost[]> = { tr: withKeys("tr"), en: withKeys("en") };

export async function getPosts(locale: Locale): Promise<LocalizedPost[]> {
  const rows = await getPublishedRows();
  if (rows === null) return localized[locale].map(post => ({ ...post, translations: { tr: localized.tr.find(p => p.key === post.key)?.slug, en: localized.en.find(p => p.key === post.key)?.slug } }));
  return rows.filter(row => row.locale === locale).map(row => ({
    ...row.content, slug: row.slug, key: row.translation_key, updatedAt: row.updated_at,
    translations: Object.fromEntries(rows.filter(p => p.translation_key === row.translation_key).map(p => [p.locale, p.slug])),
  }));
}

/** Adresteki (o dilin) slug'iyla yazi. */
export async function getPost(locale: Locale, slug: string): Promise<LocalizedPost | undefined> {
  return (await getPosts(locale)).find((p) => p.slug === slug);
}
