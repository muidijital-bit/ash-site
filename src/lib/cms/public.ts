import "server-only";
import { cache } from "react";
import { supabaseConfig } from "@/lib/supabase/config";
import { defaultBrandSettings, type BrandSettings, type CmsPost } from "./types";

export async function publicCmsRows<T>(table: "ash_blog_posts" | "ash_site_settings", query: string): Promise<T[] | null> {
  const config = supabaseConfig();
  if (!config) return null;
  const response = await fetch(`${config.url}/rest/v1/${table}?${query}`, {
    headers: { apikey: config.key },
    next: { revalidate: 300, tags: ["ash-cms"] },
  });
  if (!response.ok) throw new Error(`CMS verisi okunamadı (${response.status}).`);
  return response.json() as Promise<T[]>;
}

export const getPublishedRows = cache(async () => publicCmsRows<CmsPost>("ash_blog_posts", "select=*&status=eq.published&order=content-%3E%3Edate.desc"));

export const getBrandSettings = cache(async (): Promise<BrandSettings> => {
  const rows = await publicCmsRows<{ settings: BrandSettings }>("ash_site_settings", "select=settings&id=eq.site");
  return { ...defaultBrandSettings, ...rows?.[0]?.settings };
});
