import type { BlogPost } from "./types";

import crm_yapay_zeka_satis_otomasyonu from "./crm-yapay-zeka-satis-otomasyonu.json";
import golge_ai_kurumsal_yapay_zeka from "./golge-ai-kurumsal-yapay-zeka.json";
import sap_yapay_zeka_abap_gelistirme from "./sap-yapay-zeka-abap-gelistirme.json";
import masraf_yonetimi_neden_tikanir from "./masraf-yonetimi-neden-tikanir.json";

/** Yayin tarihine gore yeniden eskiye siralanmis blog yazilari. */
export const posts: BlogPost[] = [
  crm_yapay_zeka_satis_otomasyonu,
  golge_ai_kurumsal_yapay_zeka,
  sap_yapay_zeka_abap_gelistirme,
  masraf_yonetimi_neden_tikanir,
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
