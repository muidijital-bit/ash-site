/**
 * Dil ve adres ayarlari.
 *
 * TR varsayilan dildir ve adresleri oneksiz, Turkce yazilir (/urunler);
 * EN adresleri /en ile baslar ve Ingilizce yazilir (/en/products).
 *
 * Kod icinde sayfalar tek bir "mantiksal yol" ile anilir: segmentler ic
 * rota adlariyla (products, why-ash, blog, contact, legal), blog ve yasal
 * metinler de anahtarlariyla (Turkce slug) yazilir. localePath bu yolu
 * istenen dilin gercek adresine cevirir; proxy (src/proxy.ts) gelen
 * adresi tersine cevirip ic rotaya yonlendirir.
 */
export const locales = ["tr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "tr";

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Ic rota segmenti -> Turkce adres segmenti. Listede olmayan segment iki dilde aynidir (blog). */
const TR_SEGMENT: Record<string, string> = {
  products: "urunler",
  "why-ash": "neden-ash",
  contact: "iletisim",
  legal: "yasal",
};
const INTERNAL_SEGMENT: Record<string, string> = Object.fromEntries(
  Object.entries(TR_SEGMENT).map(([internal, tr]) => [tr, internal]),
);

/** Eski adres segmentleri; yeni karsiliklarina kalici yonlendirilir. */
export const LEGACY_SEGMENT: Record<string, string> = { "our-dna": "why-ash", news: "blog" };

/**
 * Blog yazilari ve yasal metinler: anahtar (Turkce slug) -> Ingilizce slug.
 * Icerik dosyalarindaki "slug" alanlari bu tabloyla ayni olmalidir; icerik
 * modulleri yuklenirken bunu dogrular.
 */
export const EN_SLUGS: Record<"blog" | "legal", Record<string, string>> = {
  blog: {
    "crm-yapay-zeka-satis-otomasyonu": "crm-ai-sales-automation",
    "golge-ai-kurumsal-yapay-zeka": "shadow-ai-enterprise-ai",
    "sap-yapay-zeka-abap-gelistirme": "sap-ai-abap-development",
    "masraf-yonetimi-neden-tikanir": "why-expense-management-gets-stuck",
  },
  legal: {
    "gizlilik-politikasi": "privacy-policy",
    "kvkk-aydinlatma-metni": "kvkk-privacy-notice",
    "cerez-politikasi": "cookie-policy",
  },
};

function isSlugSection(section: string): section is "blog" | "legal" {
  return section === "blog" || section === "legal";
}

/** Anahtarin o dildeki slug'i. */
export function localizedSlug(section: "blog" | "legal", key: string, locale: Locale): string {
  return locale === "en" ? (EN_SLUGS[section][key] ?? key) : key;
}

/** Dildeki slug'dan anahtara donus; bilinmeyen slug oldugu gibi doner. */
export function slugKey(section: "blog" | "legal", slug: string, locale: Locale): string {
  if (locale !== "en") return slug;
  return Object.entries(EN_SLUGS[section]).find(([, en]) => en === slug)?.[0] ?? slug;
}

/** Mantiksal yolu o dilin adresine cevirir: ("tr", "/products/sapai-x") -> "/urunler/sapai-x" */
export function localePath(locale: Locale, path: string): string {
  const [section = "", slug, ...rest] = path.split("/").filter(Boolean);
  if (!section) return locale === defaultLocale ? "/" : `/${locale}`;
  const parts = [
    locale === "tr" ? (TR_SEGMENT[section] ?? section) : section,
    ...(slug !== undefined ? [isSlugSection(section) ? localizedSlug(section, slug, locale) : slug] : []),
    ...rest,
  ];
  return `${locale === defaultLocale ? "" : `/${locale}`}/${parts.join("/")}`;
}

/**
 * Adresten dili ve mantiksal yolu cikarir.
 * Sunucu on-render'da ic rotayi (/tr/products), tarayici ise gercek adresi
 * (/urunler) gorur; ikisi de ayni sonuca indigi icin hydration sirasinda
 * fark olusmaz.
 */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const segments = pathname.split("/").filter(Boolean);
  let locale: Locale = defaultLocale;
  let internal = false;
  if (segments[0] && hasLocale(segments[0])) {
    locale = segments[0];
    internal = true; // /en/... ve /tr/... ic rota adlariyla yazilir
    segments.shift();
  }
  const [first = "", second, ...rest] = segments;
  const named = internal ? first : (INTERNAL_SEGMENT[first] ?? first);
  const section = LEGACY_SEGMENT[named] ?? named;
  const slug = second !== undefined && isSlugSection(section) ? slugKey(section, second, locale) : second;
  const parts = [section, ...(slug !== undefined ? [slug] : []), ...rest].filter(Boolean);
  return { locale, path: `/${parts.join("/")}` };
}

/** Ic rotada (app/[lang]/...) karsilik gelen yol: ("tr", "/products") -> "/tr/products" */
export function internalPath(locale: Locale, path: string): string {
  const [section = "", slug, ...rest] = path.split("/").filter(Boolean);
  const parts = [
    section,
    ...(slug !== undefined ? [isSlugSection(section) ? localizedSlug(section, slug, locale) : slug] : []),
    ...rest,
  ].filter(Boolean);
  return `/${locale}${parts.length ? `/${parts.join("/")}` : ""}`;
}

/** Sayfa metadatasi: kanonik adres ve hreflang alternatifleri. */
export function pageAlternates(locale: Locale, path: string) {
  return {
    canonical: localePath(locale, path),
    languages: {
      tr: localePath("tr", path),
      en: localePath("en", path),
      "x-default": localePath(defaultLocale, path),
    },
  };
}
