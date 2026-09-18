import type { LegalDoc } from "./types";

import gizlilik_politikasi from "./gizlilik-politikasi.json";
import kvkk_aydinlatma_metni from "./kvkk-aydinlatma-metni.json";
import cerez_politikasi from "./cerez-politikasi.json";

export const legalDocs: LegalDoc[] = [
  gizlilik_politikasi,
  kvkk_aydinlatma_metni,
  cerez_politikasi,
];

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return legalDocs.find((d) => d.slug === slug);
}
