import type { MetadataRoute } from "next";
import { products } from "@/content/products";
import { posts } from "@/content/blog";
import { legalDocs } from "@/content/legal";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (yol: string) => `${SITE_URL}${yol}`;

  return [
    { url: url("/"), changeFrequency: "monthly", priority: 1 },
    { url: url("/products"), changeFrequency: "monthly", priority: 0.9 },
    ...products.map((p) => ({ url: url(`/products/${p.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: url("/our-dna"), changeFrequency: "yearly", priority: 0.7 },
    { url: url("/news"), changeFrequency: "weekly", priority: 0.7 },
    ...posts.map((p) => ({
      url: url(`/news/${p.slug}`),
      lastModified: new Date(`${p.date}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    { url: url("/contact"), changeFrequency: "yearly", priority: 0.6 },
    ...legalDocs.map((d) => ({
      url: url(`/legal/${d.slug}`),
      lastModified: new Date(`${d.updated}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];
}
