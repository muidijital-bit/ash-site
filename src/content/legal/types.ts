/** Yasal metin semasi. src/content/legal/<slug>.json bu yapidadir. */

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalDoc = {
  slug: string;
  title: string;
  metaDescription: string;
  /** Yururluk / son guncelleme tarihi (ISO) */
  updated: string;
  intro: string[];
  sections: LegalSection[];
};
