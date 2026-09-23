import type { MetadataRoute } from "next";
import { products } from "@/content/products";
import { getPosts } from "@/content/blog";
import { getLegalDocs } from "@/content/legal";
import { SITE_URL } from "@/content/site";
import { defaultLocale, locales, localePath } from "@/i18n/config";

type Entry = Omit<MetadataRoute.Sitemap[number], "url" | "alternates"> & { path: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (yol: string) => `${SITE_URL}${yol}`;

  // Mantiksal yollar (src/i18n/config.ts); her dilin adresi localePath ile uretilir.
  const pages: Entry[] = [
    { path: "/", changeFrequency: "monthly", priority: 1 },
    { path: "/products", changeFrequency: "monthly", priority: 0.9 },
    ...products.map((p) => ({ path: `/products/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    { path: "/why-ash", changeFrequency: "yearly", priority: 0.7 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
    ...getLegalDocs(defaultLocale).map((d) => ({
      path: `/legal/${d.key}`,
      lastModified: new Date(`${d.updated}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];

  // Her sayfa iki dilde de listelenir ve birbirini hreflang ile gosterir.
  const staticPages = pages.flatMap(({ path, ...rest }) =>
    locales.map((locale) => ({
      ...rest,
      url: url(localePath(locale, path)),
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [l, url(localePath(l, path))])),
          "x-default": url(localePath(defaultLocale, path)),
        },
      },
    })),
  );
  const blogPages = await Promise.all(locales.map(async locale => (await getPosts(locale)).map(post => {
    const languages = Object.fromEntries(Object.entries(post.translations ?? {}).map(([lang, slug]) => [lang, url(localePath(lang as typeof locale, `/blog/${slug}`))]));
    return { url: url(localePath(locale, `/blog/${post.slug}`)), lastModified: new Date(post.updatedAt ?? `${post.date}T00:00:00Z`), changeFrequency: "monthly" as const, priority: 0.6, alternates: { languages: { ...languages, "x-default": languages.tr ?? languages.en } } };
  })));
  return [...staticPages, ...blogPages.flat()];
}
