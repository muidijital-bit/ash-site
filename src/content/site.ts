/**
 * Sitenin yayindaki adresi. Kanonik adres, hreflang, og: baglantilari ve
 * site haritasi bundan uretilir. On izleme gibi farkli bir ortamda
 * NEXT_PUBLIC_SITE_URL ile degistirilebilir.
 */
export const SITE_URL = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aisolutionhouse.com").origin;

/**
 * Arama motorlarina acik mi: uretim derlemesinde evet, gelistirmede
 * (next dev) hayir. Yayindan once kapali tutmak icin NEXT_PUBLIC_NOINDEX=1.
 */
export const INDEXABLE =
  process.env.NODE_ENV === "production" &&
  process.env.VERCEL_ENV !== "preview" &&
  process.env.NEXT_PUBLIC_NOINDEX !== "1";

/**
 * Urun alan adlari (hubai-x.com, sapai-x.com, masraf-x.co, crm-x.co) henuz
 * yayinda degil; acilmayan bir adres vaat etmemek icin kartlarda gizli
 * tutuluyor. Adresler yayina girince burayi true yapmak yeterli
 * (adresler src/content/products.ts icinde duruyor).
 */
export const SHOW_PRODUCT_DOMAINS = false;
