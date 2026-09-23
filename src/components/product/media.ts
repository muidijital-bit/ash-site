/**
 * Urun sayfalarindaki hazir gorsel ve videolar.
 *
 * Sayfanin varsayilan gorsel dili CSS + inline SVG'dir (bkz. visuals.tsx).
 * Bir urun icin uretilmis gercek arayuz demosu varsa o blok bu tablodan
 * beslenir; tablosuz kalan bloklar cizim mockup'lariyla dolu kalir.
 *
 * Icerik JSON'lari bu tabloya anahtarla baglanir: hero.media ve
 * sections[].items[].media alanlari buradaki anahtari tasir.
 *
 * Videolar 8 sn, sessiz ve donguludur; kamera sabittir. WebM once, MP4
 * yedek olarak verilir. Demolardaki kisi, tutar ve durumlar kurgusaldir.
 */
import type { Locale } from "@/i18n/config";

export type ProductMedia = {
  /** Video ise WebM + MP4 verilir; yoksa poster tek basina gorsel olarak durur. */
  webm?: string;
  mp4?: string;
  /** Video posteri ya da duragan gorselin kendisi. */
  poster: string;
  width: number;
  height: number;
  label: Record<Locale, string>;
};

export const PRODUCT_MEDIA: Record<string, ProductMedia> = {
  "masraf-harcama-merkezi": {
    poster: "/images/masraf-x-harcama-merkezi-a8d18026.webp",
    width: 1672,
    height: 941,
    label: {
      tr: "Masraf-X harcama merkezi: masaüstünde harcamalar ve bütçe özeti, mobilde bekleyen masraflar ve onay işlemleri.",
      en: "Masraf-X expense centre: expenses and budget overview on desktop, with pending expenses and approvals on mobile.",
    },
  },
  "masraf-mobil-fis-kontrol": {
    poster: "/images/masraf-x-mobil-fis-kontrol-f5914060.webp",
    width: 1448,
    height: 1086,
    label: {
      tr: "Telefondan taranan fişin Masraf-X formuna aktarılması; belge, mükerrer kayıt ve politika kontrolleri.",
      en: "A receipt scanned on a phone fills the Masraf-X form, with document, duplicate and policy checks.",
    },
  },
  "masraf-harcama-raporlari": {
    poster: "/images/masraf-x-harcama-raporlari-6f936d73.webp",
    width: 1448,
    height: 1086,
    label: {
      tr: "Masraf-X harcama raporları: kategoriye göre dağılım, bütçe kullanımı, yönetici onayı ve ERP aktarım durumu.",
      en: "Masraf-X expense reports: spending by category, budget usage, manager approval and ERP transfer status.",
    },
  },
  /** Masraf akis merkezi: kart Taslak'tan Onayda sutununa gecer, sayaclar 12/8 -> 11/9. */
  "masraf-akis": {
    webm: "/videos/masraf-x-akis-merkezi.webm",
    mp4: "/videos/masraf-x-akis-merkezi.mp4",
    poster: "/images/masraf-x-akis-merkezi.avif",
    width: 1672,
    height: 941,
    label: {
      tr: "Masraf-X akış merkezi: bir masraf kartı onay kuyruğuna geçerken sayaçların güncellenmesi.",
      en: "Masraf-X flow centre: an expense card moving into the approval queue as the counters update.",
    },
  },
  /** Belgeden kayda: fis tarama cizgisi ilerler, alanlar sirayla dolar. */
  "masraf-belge": {
    webm: "/videos/masraf-x-belgeden-kayda.webm",
    mp4: "/videos/masraf-x-belgeden-kayda.mp4",
    poster: "/images/masraf-x-belgeden-kayda.avif",
    width: 1448,
    height: 1086,
    label: {
      tr: "Masraf-X fiş okuma: tarama çizgisi ilerledikçe tutar, tarih ve KDV alanlarının kendiliğinden dolması.",
      en: "Masraf-X receipt reading: the amount, date and VAT fields filling in as the scan line advances.",
    },
  },
  /** Cihaz senkronu: masaustunde harcama merkezi, yaninda telefonda onay merkezi. */
  "masraf-cihazlar": {
    poster: "/images/masraf-x-cihaz-senkronu.webp",
    width: 1672,
    height: 941,
    label: {
      tr: "Masraf-X masaüstünde harcama merkezi, yanındaki telefonda aynı kayıtların onay merkezi görünümü.",
      en: "The Masraf-X expense centre on desktop, with the same records in the approval centre on the phone beside it.",
    },
  },
  /** Butce ve onay: aylik ozet, birikimli harcama grafigi ve onay sirasi. */
  "masraf-butce": {
    poster: "/images/masraf-x-butce-onay.webp",
    width: 1448,
    height: 1086,
    label: {
      tr: "Masraf-X raporlama ekranı: aylık bütçe özeti, birikimli harcama grafiği ve onay sırası.",
      en: "Masraf-X reporting screen: the monthly budget summary, cumulative spend chart and approval queue.",
    },
  },
};

export function getProductMedia(key: string | undefined): ProductMedia | undefined {
  return key ? PRODUCT_MEDIA[key] : undefined;
}
