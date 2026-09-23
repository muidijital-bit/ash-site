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
  /** media.ts icindeki hazir gorsel/video anahtari. Verilmezse cizim mockup'i kullanilir. */
  media?: string;
};

export type ProductSection = {
  kind: SectionKind | string;
  heading: string;
  sub?: string;
  /** Bolum ust etiketi. Verilmezse turune gore varsayilan etiket kullanilir. */
  eyebrow?: string;
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
    /** media.ts icindeki hazir gorsel/video anahtari. Verilmezse imza cizimi kullanilir. */
    media?: string;
    /** Baslik ve aciklamanin hemen altinda one cikarilan ozellik. */
    feature?: SectionItem;
  };
  sections: ProductSection[];
  seoTitle: string;
  seoDescription: string;
};
