import type { Locale } from "@/i18n/config";

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
  /** Urunun marka rengi (vurgu, gradyan baslangici ve bitisi) */
  accent: readonly [string, string];
};

export const products: Product[] = [
  {
    slug: "hubai-x",
    name: "HubAI-X",
    title: "Kurumsal AI Platformu",
    summary: "Kurum içi yapay zekâyı, AI asistanlarını ve token yönetimini tek merkezden yöneten kurumsal AI platformu.",
    domain: "hubai-x.com",
    accent: ["#2f6bff", "#7448e8"],
  },
  {
    slug: "sapai-x",
    name: "SAPAI-X",
    title: "SAP Yapay Zekâ",
    summary: "SAP yapay zekâ çözümü: SAP danışmanlığı ve ABAP geliştirmeyi yapay zekâ ile dakikalara indirir.",
    domain: "sapai-x.com",
    accent: ["#7448e8", "#2f6bff"],
  },
  {
    slug: "masraf-x",
    name: "Masraf-X",
    title: "Masraf Yönetimi",
    summary: "Yapay zekâ destekli masraf yönetimi: fişten onaya, politikadan ay sonu kapanışına.",
    domain: "masraf-x.co",
    accent: ["#d946b5", "#f08bc2"],
  },
  {
    slug: "crm-x",
    name: "CRM-X",
    title: "Yapay Zekâ CRM",
    summary: "Yapay zekâ CRM: müşteri, satış fırsatı ve ekip aktivitelerini tek platformda birleştirir.",
    domain: "crm-x.co",
    accent: ["#7448e8", "#d946b5"],
  },
];

/** Kategori basligi ve ozetin Ingilizcesi; ad ve alan adi iki dilde ayni. */
const english: Record<string, Pick<Product, "title" | "summary">> = {
  "hubai-x": {
    title: "Enterprise AI Platform",
    summary: "An enterprise AI platform that runs AI assistants, AI agents and token management from one hub.",
  },
  "sapai-x": {
    title: "SAP AI",
    summary: "AI for SAP: cuts SAP consulting and ABAP development down to minutes.",
  },
  "masraf-x": {
    title: "Expense Management",
    summary: "AI expense management: from receipt to approval, from policy to month-end close.",
  },
  "crm-x": {
    title: "AI CRM",
    summary: "AI CRM that brings customers, sales opportunities and team activities together on one platform.",
  },
};

export function getProducts(locale: Locale): Product[] {
  return locale === "en" ? products.map((p) => ({ ...p, ...english[p.slug] })) : products;
}

export const getProduct = (slug: string, locale: Locale) => getProducts(locale).find((p) => p.slug === slug);
