/**
 * Iletisim bilgileri tek kaynakta.
 *
 * Hero, harita ve form bolumleri buradan beslenir. Bos birakilan alanlar
 * sayfada hic gosterilmez: satir/blok tumuyle kaldirilir, "yakinda eklenecek"
 * yazisi cikmaz. Telefon netlesince asagiya yazmak yeterli, gerisi kendiliginden
 * yerine oturur.
 */

import type { Locale } from "@/i18n/config";

export type Office = {
  id: string;
  name: Record<Locale, string>;
  lines: string[];
  /** Google Maps vb. baglanti; bos ise harita baglantisi gosterilmez */
  mapUrl: string;
};

export type ContactInfo = {
  email: string;
  phone: string;
  offices: Office[];
  hours: string;
};

export const contact: ContactInfo = {
  email: "hello@aisolutionhouse.com",
  phone: "",
  offices: [
    {
      id: "istanbul",
      name: { tr: "İstanbul Ofisi", en: "Istanbul Office" },
      lines: ["Zorlu Center", "Levazım Mah. Koru Sk. No:2", "34340 Beşiktaş, İstanbul"],
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Zorlu+Center%2C+Levaz%C4%B1m+Mah.+Koru+Sk.+No%3A2%2C+34340+Be%C5%9Fikta%C5%9F%2C+%C4%B0stanbul",
    },
    {
      id: "london",
      name: { tr: "Londra Ofisi", en: "London Office" },
      lines: ["50 Liverpool Street", "City of London, EC2M 7QA", "United Kingdom"],
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=50+Liverpool+Street%2C+City+of+London%2C+EC2M+7QA%2C+United+Kingdom",
    },
  ],
  hours: "",
};
