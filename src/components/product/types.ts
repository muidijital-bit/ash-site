/** Urun sayfasi icerik semasi. src/content/product-pages/<slug>.json bu yapidadir. */

export type SectionKind =
  | "ozellikler"
  | "nasil-calisir"
  | "farklar"
  | "kullanim-senaryolari"
  | "istatistik"
  | "sss"
  | "cta";

export type SectionItem = {
  title: string;
  body: string;
};

export type ProductSection = {
  kind: SectionKind | string;
  heading: string;
  sub?: string;
  items: SectionItem[];
  /** Icerik ekibinin gorsel notu; sayfada gosterilmez. */
  visual?: string;
};

export type ProductPageContent = {
  key: string;
  name: string;
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    cta: string;
    visual?: string;
  };
  sections: ProductSection[];
  seoTitle: string;
  seoDescription: string;
};
