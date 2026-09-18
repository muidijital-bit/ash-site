/** Blog yazisi semasi. src/content/blog/<slug>.json bu yapidadir. */

export type BlogSection = {
  heading: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  metaDescription: string;
  category: string;
  summary: string;
  readingMinutes: number;
  /** ISO tarih (YYYY-MM-DD) — yayin tarihi */
  date: string;
  author: { name: string; role: string };
  intro: string[];
  sections: BlogSection[];
  takeaways: string[];
  faq: { q: string; a: string }[];
  /** Kapak gorseli: public/ altindaki yol */
  cover: string;
};
