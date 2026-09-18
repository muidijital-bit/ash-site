/**
 * ASH urun ailesi.
 *
 * Tek kaynak: menudeki acilir liste, urunler sayfasi ve urun detay rotalari
 * bu listeden beslenir. Yeni urun eklemek icin buraya bir kayit eklemek yeterli.
 */
export type Product = {
  /** URL parcasi: /products/<slug> */
  slug: string;
  /** Urun adi (marka) */
  name: string;
  /** Kategori basligi */
  title: string;
  /** Menude ve kartlarda gorunen tek cumlelik ozet */
  summary: string;
  /** Yayindaki alt domain */
  domain: string;
};

export const products: Product[] = [
  {
    slug: "hubai-x",
    name: "HubAI-X",
    title: "Kurumsal Yapay Zeka",
    summary: "Kurumsal süreçleri uçtan uca yapay zekâ ile yöneten şemsiye platform.",
    domain: "hubai-x.com",
  },
  {
    slug: "sapai-x",
    name: "SAPAI-X",
    title: "SAP Yapay Zeka",
    summary: "SAP danışmanlığı ve ABAP geliştirmeyi yapay zekâ ile dakikalara indirir.",
    domain: "sapai-x.com",
  },
  {
    slug: "masraf-x",
    name: "Masraf-X",
    title: "Masraf Solution",
    summary: "Kurumsal harcama yönetimi: fişten onaya, politikadan ay sonu kapanışına.",
    domain: "masraf-x.co",
  },
  {
    slug: "crm-x",
    name: "CRM-X",
    title: "CRM",
    summary: "Müşteri, satış fırsatı ve ekip aktivitelerini tek platformda birleştirir.",
    domain: "crm-x.co",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
