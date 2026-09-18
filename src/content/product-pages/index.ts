import type { ProductPageContent } from "@/components/product/types";
import crmX from "./crm-x.json";
import hubaiX from "./hubai-x.json";
import masrafX from "./masraf-x.json";
import sapaiX from "./sapai-x.json";

/** Urun detay sayfalarinin icerigi. Metinleri duzenlemek icin ilgili .json dosyasini degistirin. */
export const productPages: Record<string, ProductPageContent> = {
  "hubai-x": hubaiX,
  "sapai-x": sapaiX,
  "masraf-x": masrafX,
  "crm-x": crmX,
};
