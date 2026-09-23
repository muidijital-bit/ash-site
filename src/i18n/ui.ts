import type { Locale } from "./config";

/**
 * Bilesenlere gomulu kisa arayuz metinleri (menu, etiket, erisim metni).
 * Sayfa icerikleri kendi JSON dosyalarinda durur; burada yalnizca kod
 * icinde gecen kaliplar var.
 */
const tr = {
  dateLocale: "tr-TR",
  openGraphLocale: "tr_TR",
  siteTitle: "AI Solution House — Kurumsal Yapay Zekâ ve SAP Çözümleri",
  siteDescription:
    "Pilot projede kalmayan kurumsal yapay zekâ çözümleri: SAP ve ERP entegrasyonu, süreç otomasyonu, harcama ve müşteri yönetimi. HubAI-X, SAPAI-X, Masraf-X, CRM-X.",

  nav: { home: "Anasayfa", products: "Ürünler", why: "Neden ASH", blog: "Blog", contact: "İletişim" },
  skipToContent: "İçeriğe geç",
  homeAria: "ana sayfa",
  menuToggle: "Menüyü aç veya kapat",
  mainNav: "Ana menü",
  footerNav: "Alt menü",
  allProducts: "Tüm ürünler",
  backToTop: "Başa dön",
  /** Dil degistirici: diger dilin kisa adi ve erisim metni */
  switchTo: { short: "EN", label: "Switch to English" },

  carouselFallback: "Öne çıkanlar",
  prevPost: "Önceki yazı",
  nextPost: "Sonraki yazı",
  live: "Canlı",
  ask: "Sor",
  scanning: "Kurumsal veriler taranıyor",
  askPlaceholder: "Bir soru yazın…",

  productsIndex: {
    metaTitle: "Kurumsal Yapay Zekâ Ürünleri",
    metaDescription:
      "Kurumsal yapay zekâ, SAP, masraf ve müşteri yönetimi için ASH ürün ailesi: HubAI-X, SAPAI-X, Masraf-X ve CRM-X.",
    label: "Ürün ailemiz",
    title: ["Kurumsal süreçleri yeniden ", "tasarlayan ürünler"],
    lead:
      "Her biri kurumsal bir ihtiyaçtan doğdu, sahada çalışan ekiplerle birlikte olgunlaştı. Dört ürün, tek bir yaklaşım: mevcut sisteminizi anlayan, onayınız olmadan işlem yapmayan yapay zekâ.",
    viewProduct: "Ürünü keşfet",
    strip: "Hangi ürünün size uygun olduğunu birlikte belirleyelim.",
  },
  product: {
    eyebrow: {
      ozellikler: "Özellikler",
      "nasil-calisir": "Nasıl çalışır",
      farklar: "Farkımız",
      "kullanim-senaryolari": "Kullanım senaryoları",
      istatistik: "Neler kazanırsınız",
      sss: "Sık sorulan sorular",
    } as Record<string, string>,
    familyLabel: "Ürün ailesi",
    familyTitle: ["Keşfetmeye ", "devam edin"],
    talkAbout: (name: string) => `${name} hakkında konuşalım.`,
    useCaseLabel: "Kurumsal kazanım",
  },
  getInTouch: "İletişime geçin",

  blog: {
    metaTitle: "Kurumsal Yapay Zekâ ve SAP Blogu",
    metaDescription:
      "Kurumsal yapay zekâ, SAP, masraf ve müşteri yönetimi üzerine ASH ekibinin sahadan çıkardığı notlar.",
    label: "Blog",
    title: "Kurumsal yapay zekâya dair saha notları",
    lead: "Projelerde tekrar tekrar karşımıza çıkan sorular, tıkanma noktaları ve işe yarayan yaklaşımlar.",
    readingTime: (min: number) => `${min} dk okuma`,
    takeaways: "Özetle",
    faq: "Sık sorulan sorular",
    allPosts: "← Tüm yazılar",
    talkBefore: "Bu konuyu konuşmak için ",
    talkLink: "bize yazın",
    talkAfter: ".",
    inLanguage: "tr-TR",
  },
  legal: { label: "Yasal", updated: "Son güncelleme" },
  notFound: {
    metaTitle: "Sayfa bulunamadı",
    title: "Aradığınız sayfa burada değil",
    meta: "Adres değişmiş ya da sayfa kaldırılmış olabilir.",
    lead: "Buradan devam edebilirsiniz:",
  },
  contact: {
    metaTitle: "İletişim | İstanbul ve Londra",
    metaDescription:
      "Kurumsal yapay zekâ ve SAP projeleriniz için ASH ile iletişime geçin. İstanbul ve Londra ofislerimizle ihtiyacınıza uygun çözümü birlikte belirleyelim.",
    email: "E-posta",
    phone: "Telefon",
    address: "Adres",
    hours: "Çalışma saatleri",
    office: "Ofis",
    directions: "Haritada aç",
    mapAttribution: "OpenStreetMap katkıda bulunanlar",
    notSent:
      "Form henüz bir gönderim servisine bağlı değil, bu yüzden mesajınız bize ulaşmadı. Yazdıklarınız bu tarayıcıda saklandı; bağlantı kurulduğunda tekrar göndermeniz yeterli olacak.",
    mapAria: "Ofis konumu",
  },
  why: {
    metaTitle: "Neden ASH? SAP ve Yapay Zekâ Uzmanlığı",
    metaDescription:
      "Mevcut sisteminizi okuyarak başlayan, pilotta kalmayan ve devredilebilir iş bırakan bir çalışma biçimi. ASH'in altı değeri ve keşiften canlı sonrasına beş adımı.",
    toMission: "Misyonumuza geç",
  },
  video: { dialog: "ASH'i keşfedin", close: "Videoyu kapat", title: "ASH tanıtım videosu", unavailable: "Bu video şu anda kullanılamıyor." },
};

type Dictionary = typeof tr;

const en: Dictionary = {
  dateLocale: "en-GB",
  openGraphLocale: "en_US",
  siteTitle: "AI Solution House — Enterprise AI and SAP Solutions",
  siteDescription:
    "Enterprise AI that reaches production, not just a pilot: SAP and ERP integration, process automation, spend and customer management. HubAI-X, SAPAI-X, Masraf-X, CRM-X.",

  nav: { home: "Home", products: "Products", why: "Why ASH", blog: "Blog", contact: "Contact" },
  skipToContent: "Skip to content",
  homeAria: "home page",
  menuToggle: "Open or close the menu",
  mainNav: "Main menu",
  footerNav: "Footer menu",
  allProducts: "All products",
  backToTop: "Back to top",
  switchTo: { short: "TR", label: "Türkçeye geç" },

  carouselFallback: "Highlights",
  prevPost: "Previous post",
  nextPost: "Next post",
  live: "Live",
  ask: "Ask",
  scanning: "Scanning company data",
  askPlaceholder: "Type a question…",

  productsIndex: {
    metaTitle: "Enterprise AI Products",
    metaDescription:
      "The ASH product family for enterprise AI, SAP, expense and customer management: HubAI-X, SAPAI-X, Masraf-X and CRM-X.",
    label: "Our product family",
    title: ["Products that redesign ", "enterprise processes"],
    lead:
      "Each one was born from a real enterprise need and matured alongside teams in the field. Four products, one approach: AI that understands your existing system and never acts without your approval.",
    viewProduct: "Explore product",
    strip: "Let's work out together which product fits you best.",
  },
  product: {
    eyebrow: {
      ozellikler: "Features",
      "nasil-calisir": "How it works",
      farklar: "Why it's different",
      "kullanim-senaryolari": "Use cases",
      istatistik: "What you gain",
      sss: "Frequently asked questions",
    },
    familyLabel: "Product family",
    familyTitle: ["Keep ", "exploring"],
    talkAbout: (name: string) => `Let's talk about ${name}.`,
    useCaseLabel: "Business benefit",
  },
  getInTouch: "Get in touch",

  blog: {
    metaTitle: "Enterprise AI and SAP Blog",
    metaDescription:
      "Field notes from the ASH team on enterprise AI, SAP, expense management and customer management.",
    label: "Blog",
    title: "Field notes on enterprise AI",
    lead: "The questions, bottlenecks and working approaches we run into again and again on real projects.",
    readingTime: (min: number) => `${min} min read`,
    takeaways: "Key takeaways",
    faq: "Frequently asked questions",
    allPosts: "← All posts",
    talkBefore: "Want to talk this through? ",
    talkLink: "Write to us",
    talkAfter: ".",
    inLanguage: "en",
  },
  legal: { label: "Legal", updated: "Last updated" },
  notFound: {
    metaTitle: "Page not found",
    title: "The page you're looking for isn't here",
    meta: "The address may have changed or the page may have been removed.",
    lead: "You can continue from here:",
  },
  contact: {
    metaTitle: "Contact | Istanbul and London",
    metaDescription:
      "Contact ASH for enterprise AI and SAP projects. Talk to our Istanbul and London offices to find the right technology and solution for your business.",
    email: "Email",
    phone: "Phone",
    address: "Address",
    hours: "Working hours",
    office: "Office",
    directions: "Open in maps",
    mapAttribution: "OpenStreetMap contributors",
    notSent:
      "This form isn't connected to a delivery service yet, so your message has not reached us. What you wrote has been saved in this browser; once the connection is live, you only need to send it again.",
    mapAria: "Office location",
  },
  why: {
    metaTitle: "Why ASH? SAP and AI Expertise",
    metaDescription:
      "Discover how ASH combines SAP project experience with enterprise AI expertise, from understanding your systems to integration and production support.",
    toMission: "Skip to our mission",
  },
  video: { dialog: "Discover ASH", close: "Close video", title: "ASH introduction video", unavailable: "This video is currently unavailable." },
};

const dictionaries: Record<Locale, Dictionary> = { tr, en };

export function getUi(locale: Locale): Dictionary {
  return dictionaries[locale];
}
