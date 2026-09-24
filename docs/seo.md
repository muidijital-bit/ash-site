# SEO: anahtar kelime ve sayfa eşleştirmesi

24 Eylül 2026'da verilen anahtar kelime listesine göre kuruldu. Her kelime grubu tek
bir sayfaya aittir; aynı kelimeyle iki sayfa yarışmaz. Yeni içerik yazarken ilgili
sayfanın kelimesini başlıkta (H1), giriş paragrafında ve title/açıklamada kullanın.

| Sayfa | Türkçe kelimeler | İngilizce kelimeler |
| --- | --- | --- |
| Ana sayfa `/` | kurumsal yapay zeka, kurumsal yapay zeka çözümleri, yapay zeka çözümleri, kurumlar için yapay zeka, Türkiye'de yapay zeka yapan firmalar | enterprise AI solutions, enterprise artificial intelligence, AI solutions for enterprises |
| Ürünler `/urunler` | yapay zeka çözümleri (ürün ailesi) | AI solutions for enterprises |
| HubAI-X | kurumsal AI platformu, kurum içi yapay zeka, kurumsal AI asistan, yapay zeka token yönetimi | enterprise AI platform, AI assistant for enterprise, corporate AI assistant, AI knowledge base, enterprise AI agents, AI agent platform |
| SAPAI-X | SAP yapay zeka, SAP yapay zeka çözümleri, SAP danışmanlık yapay zeka, SAP danışmanlık otomasyonu | SAP AI, SAP AI solutions, AI for SAP, SAP ABAP AI, SAP development AI, SAP automation |
| Masraf-X | yapay zeka destekli masraf yönetimi, dijital masraf yönetimi, masraf giriş programları, akıllı personel masraf yönetimi | expense management software, AI expense management |
| CRM-X | yapay zeka CRM | AI CRM, AI sales automation, sales automation software, CRM automation |
| Neden ASH | kurumsal yapay zeka firmaları, SAP danışmanlık yapay zeka | enterprise AI experts |

"SAP S/4HANA AI" kullanılmadı: SAPAI-X'in S/4HANA desteği içerikte doğrulanmış bir
bilgi değil. Doğrulanınca SAPAI-X sayfasına eklenebilir.

## Nerede ne var

- Title ve açıklama: ürünler `src/content/product-pages/*.json` (`seoTitle`,
  `seoDescription`), diğer sayfalar `src/i18n/ui.ts` (`metaTitle`, `metaDescription`,
  ana sayfa `siteTitle`, `siteDescription`). Title ~60, açıklama ~150–160 karakter.
- Yapılandırılmış veri: ana sayfada kurum (adres, e-posta, uzmanlık alanları);
  alt sayfalarda breadcrumb (`breadcrumbJsonLd`, `src/lib/seo.ts`); ürünler
  dizininde ürün listesi; ürün ve blog sayfalarında SSS; blog yazılarında makale.
- Blog yazılarının metninde her ürün adının (HubAI-X, SAPAI-X, Masraf-X, CRM-X) ilk geçtiği
  yer ürün sayfasına bağlanır (`src/components/blog/productLinks.tsx`); panelden yazılan
  Markdown yazılarda da çalışır, başlıklara ve mevcut bağlantılara dokunmaz.
- Blog yazılarının altındaki "ilgili ürün" kartı, kategori ve başlığa bakarak
  ürünü seçer (`relatedProductSlug`, `src/components/blog/BlogPost.tsx`); panelden
  yazılan yazılarda da çalışır.
