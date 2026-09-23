import type { ProductPageContent } from "@/components/product/types";
import type { Locale } from "@/i18n/config";
import crmX from "./crm-x.json";
import hubaiX from "./hubai-x.json";
import masrafX from "./masraf-x.json";
import sapaiX from "./sapai-x.json";
import crmXEn from "./en/crm-x.json";
import hubaiXEn from "./en/hubai-x.json";
import masrafXEn from "./en/masraf-x.json";
import sapaiXEn from "./en/sapai-x.json";

/**
 * Urun detay sayfalarinin icerigi. Metinleri duzenlemek icin ilgili .json
 * dosyasini degistirin: Turkce <slug>.json, Ingilizce en/<slug>.json.
 */
const productPages: Record<Locale, Record<string, ProductPageContent>> = {
  tr: { "hubai-x": hubaiX, "sapai-x": sapaiX, "masraf-x": masrafX, "crm-x": crmX },
  en: { "hubai-x": hubaiXEn, "sapai-x": sapaiXEn, "masraf-x": masrafXEn, "crm-x": crmXEn },
};

export function getProductPage(locale: Locale, slug: string): ProductPageContent | undefined {
  return productPages[locale][slug];
}
