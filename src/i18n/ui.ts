import type { Locale } from "./config";

/**
 * Bilesenlere gomulu kisa arayuz metinleri (menu, etiket, erisim metni).
 * Sayfa icerikleri kendi JSON dosyalarinda durur; burada yalnizca kod
 * icinde gecen kaliplar var.
 */
const tr = {
  dateLocale: "tr-TR",
  openGraphLocale: "tr_TR",
  siteTitle: "Kurumsal Yapay Zekâ Çözümleri ve SAP AI | AI Solution House",
  siteDescription:
    "Türkiye'de kurumsal yapay zekâ çözümleri geliştiren AI Solution House: kurumsal AI platformu, SAP yapay zekâ, yapay zekâ CRM ve dijital masraf yönetimi.",

  /** Kurum semasindaki uzmanlik alanlari (arama motorlari icin) */
  knowsAbout: ["Kurumsal yapay zekâ", "Kurumsal AI platformu", "SAP yapay zekâ", "ABAP geliştirme", "Yapay zekâ destekli masraf yönetimi", "Yapay zekâ CRM", "Yapay zekâ token yönetimi"],
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
    metaTitle: "Yapay Zekâ Çözümleri ve Ürünleri",
    metaDescription:
      "Kurumlar için yapay zekâ çözümleri: kurumsal AI platformu HubAI-X, SAP yapay zekâ SAPAI-X, yapay zekâ destekli masraf yönetimi Masraf-X ve yapay zekâ CRM'i CRM-X.",
    label: "Ürün ailemiz",
    title: ["Kurumsal süreçleri yeniden ", "tasarlayan yapay zekâ ürünleri"],
    lead:
      "Her biri kurumsal bir ihtiyaçtan doğdu, sahada çalışan ekiplerle birlikte olgunlaştı. Dört kurumsal yapay zekâ çözümü, tek bir yaklaşım: mevcut sisteminizi anlayan, onayınız olmadan işlem yapmayan yapay zekâ.",
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
      "Kurumsal yapay zekâ, SAP yapay zekâ, dijital masraf yönetimi ve yapay zekâ CRM üzerine ASH ekibinin sahadan notları: gölge AI, ABAP geliştirme, satış otomasyonu.",
    label: "Blog",
    title: "Kurumsal yapay zekâya dair saha notları",
    relatedProduct: "Bu yazıyla ilgili ürün",
    viewProduct: "Ürünü inceleyin",
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
      "Kurumsal yapay zekâ ve SAP yapay zekâ projeleriniz için ASH ile iletişime geçin. İstanbul ve Londra ofislerimizle size uygun AI çözümünü belirleyelim.",
    email: "E-posta",
    phone: "Telefon",
    address: "Adres",
    hours: "Çalışma saatleri",
    office: "Ofis",
    directions: "Haritada aç",
    mapAttribution: "OpenStreetMap katkıda bulunanlar",
    sent: "Teşekkürler, mesajınız bize ulaştı. En kısa sürede size dönüş yapacağız.",
    invalid:
      "Lütfen alanları kontrol edin: ad soyad, geçerli bir e-posta adresi ve en az birkaç kelimelik bir mesaj gerekli.",
    failed:
      "Mesajınız şu an gönderilemedi. Yazdıklarınız bu tarayıcıda saklandı; biraz sonra tekrar deneyebilir ya da doğrudan bu adrese yazabilirsiniz:",
    /** Formun altindaki not: [once, baglanti metni, sonra] */
    privacy: ["Kişisel verileriniz ", "KVKK Aydınlatma Metni", " kapsamında işlenir."],
    mapAria: "Ofis konumu",
    bookMeeting: "Toplantı Planlayın",
    meetingNewTab: "Takvim açılmazsa yeni sekmede açın",
    meetingClose: "Kapat",
  },
  why: {
    metaTitle: "Neden ASH? Kurumsal Yapay Zekâ Firması",
    metaDescription:
      "Türkiye'de kurumsal yapay zekâ çözümleri geliştiren ASH, SAP danışmanlık deneyimini yapay zekâ ile birleştirir. Keşiften canlıya beş adımda üretimde çalışan AI.",
    toMission: "Misyonumuza geç",
  },
  consent: {
    label: "Çerez tercihleri",
    text: "Onay verirseniz, siteyi geliştirmek için Google Analytics ile ziyaret istatistikleri topluyoruz. Reklam çerezi kullanmıyoruz.",
    policy: "Çerez Politikası",
    accept: "Kabul et",
    reject: "Reddet",
    preferences: "Çerez tercihleri",
  },
  video: { dialog: "ASH'i keşfedin", close: "Videoyu kapat", title: "ASH tanıtım videosu", unavailable: "Bu video şu anda kullanılamıyor." },
};

type Dictionary = typeof tr;

const en: Dictionary = {
  dateLocale: "en-GB",
  openGraphLocale: "en_US",
  siteTitle: "Enterprise AI Solutions and SAP AI | AI Solution House",
  siteDescription:
    "AI Solution House builds enterprise AI solutions: an enterprise AI platform, SAP AI, AI CRM and AI expense management, built to reach production, not stay a pilot.",

  knowsAbout: ["Enterprise AI", "Enterprise AI platform", "SAP AI", "ABAP development", "AI expense management", "AI CRM", "AI token management"],
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
    metaTitle: "AI Solutions for Enterprises",
    metaDescription:
      "AI solutions for enterprises: the HubAI-X enterprise AI platform, SAPAI-X for SAP AI, Masraf-X for AI expense management and the CRM-X AI CRM.",
    label: "Our product family",
    title: ["Enterprise AI products that ", "redesign how you work"],
    lead:
      "Each one was born from a real enterprise need and matured alongside teams in the field. Four enterprise AI solutions, one approach: AI that understands your existing system and never acts without your approval.",
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
      "Field notes from the ASH team on enterprise AI, SAP AI, AI expense management and AI CRM: shadow AI, ABAP development and sales automation.",
    label: "Blog",
    title: "Field notes on enterprise AI",
    relatedProduct: "Related product",
    viewProduct: "Explore the product",
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
      "Contact ASH for enterprise AI and SAP AI projects. Talk to our Istanbul and London offices to find the right AI solution for your organization.",
    email: "Email",
    phone: "Phone",
    address: "Address",
    hours: "Working hours",
    office: "Office",
    directions: "Open in maps",
    mapAttribution: "OpenStreetMap contributors",
    sent: "Thank you, your message has reached us. We'll get back to you as soon as possible.",
    invalid:
      "Please check the fields: we need your full name, a valid email address and a message of at least a few words.",
    failed:
      "Your message couldn't be sent right now. What you wrote has been saved in this browser; you can try again shortly or write to us directly at:",
    privacy: ["Your personal data is processed in line with our ", "KVKK Privacy Notice", "."],
    mapAria: "Office location",
    bookMeeting: "Book a Meeting",
    meetingNewTab: "Calendar not loading? Open it in a new tab",
    meetingClose: "Close",
  },
  why: {
    metaTitle: "Why ASH? Enterprise AI and SAP AI Experts",
    metaDescription:
      "ASH builds enterprise AI solutions and SAP AI from Istanbul and London, combining SAP consulting experience with enterprise AI that reaches production.",
    toMission: "Skip to our mission",
  },
  consent: {
    label: "Cookie preferences",
    text: "With your consent, we use Google Analytics to collect visit statistics that help us improve the site. We don't use advertising cookies.",
    policy: "Cookie Policy",
    accept: "Accept",
    reject: "Reject",
    preferences: "Cookie preferences",
  },
  video: { dialog: "Discover ASH", close: "Close video", title: "ASH introduction video", unavailable: "This video is currently unavailable." },
};

const dictionaries: Record<Locale, Dictionary> = { tr, en };

export function getUi(locale: Locale): Dictionary {
  return dictionaries[locale];
}
