import type { MetadataRoute } from "next";
import { INDEXABLE, SITE_URL } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: INDEXABLE ? { userAgent: "*", allow: "/" } : { userAgent: "*", disallow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
