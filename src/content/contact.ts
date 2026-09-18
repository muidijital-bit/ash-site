/**
 * Iletisim bilgileri tek kaynakta.
 *
 * Telefon ve e-posta henuz netlesmedi; degerler bos birakildi.
 * Gercek bilgiler gelince SADECE bu dosyayi doldurmak yeterli —
 * hero, harita ve form bolumleri buradan besleniyor.
 * Bos birakilan alanlar sayfada "yakinda eklenecek" olarak gosterilir.
 */

export type Company = {
  /** Tam ticari unvan, or. "... Bilisim Teknolojileri A.S." */
  legalName: string;
  /** MERSIS numarasi */
  mersis: string;
  /** VERBIS kayit bilgisi (varsa) */
  verbis: string;
};

/** Yasal metinlerde gecen sirket bilgileri. Bos alanlar sayfada koseli
    parantezli isaret olarak gorunur; doldurulunca metne yerlesir. */
export const company: Company = {
  legalName: "",
  mersis: "",
  verbis: "",
};

export type ContactInfo = {
  email: string;
  phone: string;
  office: {
    title: string;
    lines: string[];
    /** Google Maps vb. baglanti; bos ise harita baglantisi gosterilmez */
    mapUrl: string;
  };
  hours: string;
};

export const contact: ContactInfo = {
  email: "",
  phone: "",
  office: {
    title: "Ofis",
    lines: [],
    mapUrl: "",
  },
  hours: "",
};

/** Bos alanlar icin sayfada gosterilecek metin. */
export const YAKINDA = "Yakında eklenecek";
