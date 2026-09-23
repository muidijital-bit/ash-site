import type { BlogPost } from "@/content/blog/types";
import type { Locale } from "@/i18n/config";

export type CmsPost = {
  id: string;
  locale: Locale;
  translation_key: string;
  slug: string;
  status: "draft" | "published";
  content: BlogPost;
  version: number;
  updated_at: string;
};

export type BrandSettings = { logoLight: string; logoDark: string; favicon: string };
export const defaultBrandSettings: BrandSettings = {
  logoLight: "/brand/ash-dark.svg",
  logoDark: "/brand/ash-light.svg",
  favicon: "/theme/favicon.svg",
};
