import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * NEXT_PUBLIC_SITE_URL tanimli degilken (yerel / on izleme) site aramaya
 * kapali kalir. Gercek alan adi tanimlandiginda tarama acilir.
 */
const yayinda = Boolean(process.env.NEXT_PUBLIC_SITE_URL);

export default function robots(): MetadataRoute.Robots {
  return {
    rules: yayinda ? { userAgent: "*", allow: "/" } : { userAgent: "*", disallow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
