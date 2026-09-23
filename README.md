# AI Solution House — Kurumsal site

ASH'in tanıtım sitesi. Next.js 16 (App Router) + TypeScript.

## Çalıştırma

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # üretim derlemesi
```

Node sürümü `.nvmrc` dosyasında.

## Sayfalar

Site iki dillidir. Türkçe adresler öneksiz, İngilizceler `/en` ile başlar; her dil
kendi dilinde yazılır. Sayfanın üstündeki TR / EN bağlantısı aynı sayfanın diğer
dildeki karşılığına gider.

| Türkçe | İngilizce | İçerik |
| --- | --- | --- |
| `/` | `/en` | Anasayfa |
| `/urunler` · `/urunler/[ürün]` | `/en/products` · `/en/products/[ürün]` | Ürün ailesi ve dört ürün sayfası |
| `/neden-ash` | `/en/why-ash` | Neden ASH |
| `/blog` · `/blog/[yazı]` | `/en/blog` · `/en/blog/[post]` | Blog |
| `/iletisim` | `/en/contact` | İletişim |
| `/yasal/[metin]` | `/en/legal/[notice]` | Gizlilik, KVKK, çerez metinleri |

Adres eşlemesi, blog ve yasal metinlerin İngilizce slug'ları `src/i18n/config.ts`
içindedir; `src/proxy.ts` gelen adresi iç rotaya (`src/app/[lang]/...`) çevirir ve
eski adresleri (`/products`, `/our-dna`, `/news` …) yenilerine kalıcı yönlendirir.

## İçerik nerede

Metinler koddan ayrı durur; bileşene dokunmadan değiştirilebilir.

```
src/content/
  site.ts             sitenin adresi (www.aisolutionhouse.com) ve arama motoru ayarı
  brand.ts            marka adı, logo, tanıtım videosu
  contact.ts          e-posta, telefon, İstanbul ve Londra adresleri
  products.ts         ürün listesi (nav, dizin ve kartları besler; İngilizcesi aynı dosyada)
  product-pages/      dört ürün sayfasının metni (İngilizcesi en/ altında)
  blog/               blog yazıları (İngilizcesi en/ altında)
  legal/              yasal metinler (İngilizcesi en/ altında)

src/components/theme/**/*.content.json      tema bölümlerinin metinleri
src/components/theme/**/*.content.en.json   aynı metinlerin İngilizcesi
src/components/theme/**/*.assets.json       tema bölümlerinin görselleri
src/i18n/ui.ts                              menü, etiket, erişim metinleri (iki dil)
```

## Yayına çıkmadan önce

1. **Alan adı `www.aisolutionhouse.com`.** Canonical, hreflang ve site haritası bu adresle
   üretilir (`src/content/site.ts`). Ana domain ve `www`, Vercel projesine eklendi;
   Cloudflare'e nameserver geçişi bekleniyor. [Yayın ve DNS rehberi](docs/deployment.md).
   Üretimde `NEXT_PUBLIC_NOINDEX=0`, önizlemede `1` kullanılır.
   Vercel adresleri ayrıca `X-Robots-Tag: noindex, follow` başlığı alır. `www` olmadan
   gelen alan adı isteği `www` adresine kalıcı yönlenir. DNS bağlantısı bu kodla yapılmaz.
2. **Ürün alan adları.** `hubai-x.com`, `sapai-x.com`, `masraf-x.co` ve `crm-x.co`
   yayına girince `src/content/site.ts` içindeki `SHOW_PRODUCT_DOMAINS` değerini `true`
   yapın; adresler ürün kartlarında yeniden görünür.
3. **İletişim bilgileri.** İstanbul/Londra ofisleri ve e-posta tanımlıdır.
   Kurumsal telefon eklenirse `src/content/contact.ts` üzerinden yayınlanabilir; boş alanlar gizlenir.
4. **İletişim formunu bir servise bağlayın.** Şu an form ve bülten kaydı hiçbir yere
   gönderim yapmaz; yalnızca tarayıcıda taslak tutarlar ve bunu kullanıcıya bildirirler.
5. **Yasal metinleri hukukçuya okutun.** `src/content/legal/` altındaki üç metin (ve
   İngilizceleri) taslaktır.
6. **Dağıtım.** `muidijital-bit/ash-site` deposunun `main` dalı Vercel üretim ortamına
   bağlıdır; Git push otomatik derleme ve yayın başlatır. Kendi sunucunuza taşırsanız
   `next.config.ts` içindeki nota bakın (`output: "standalone"` + `public/` ve `.next/static`).

## Notlar

- Tema CSS'i `public/theme/css` altındadır ve **değiştirilmez**; marka uyarlamaları
  `src/app/brand.css` ve `src/app/globals.css` içinde override olarak yazılır.
- Görseller SVG, WebP ve AVIF olarak sunulur; stok fotoğraf kullanılmaz.
  Anasayfadaki iki kişi fotoğrafı kurumdan geldi; arka planları kesilip 1116×1116 şeffaf
  WebP'ye çevrildi ve yüz boyutları eşitlendi.
- `public/images` ve `public/videos` 30 gün önbelleklenir: bir dosyanın içeriği
  değişirse **dosya adı da değişmeli**, yoksa ziyaretçiler eskisini görmeye devam eder.
- Paylaşım görselleri (og:image) `opengraph-image.tsx` dosyalarında 1200×630 PNG olarak
  üretilir; her sayfa ve her dil kendi kartını alır (`src/components/og/card.tsx`).
- Bulunamayan adreslerin 404 sayfası `src/app/global-not-found.tsx` içindedir: kök layout
  dile göre ayrıldığı için (`app/[lang]`) 404 sunucuda burada üretilir.

## SEO ve kalite kontrolü

- Her sayfanın title, açıklama, canonical, TR/EN/x-default, Open Graph ve Twitter
  metadatası `src/lib/seo.ts` üzerinden üretilir. Görünür başlıklar içerik dosyalarında kalır.
- Ürün görselleri `next/image` ile ekran boyutuna göre AVIF/WebP olarak sunulur.
  Video posterleri AVIF; ofis haritası AVIF ve WebP yedeği kullanır. Ekranın altındaki
  görseller gecikmeli yüklenir; video oynatma yalnızca görünür alanda başlar.
- `GOOGLE_SITE_VERIFICATION` alanına Search Console'un verdiği gerçek doğrulama kodu
  eklenip yeniden dağıtılabilir. Domain bağlandıktan sonra Search Console'a
  `https://www.aisolutionhouse.com/sitemap.xml` gönderilir.
- Teknik SEO hazırlığı sıralama veya indekslenme garantisi değildir. Alan adı/DNS ve
  Search Console kurulumu ayrıca yapılır. İletişim formu/bülten servisi henüz bağlı değildir.

```bash
npm run check
python3 scripts/audit-site.py --base https://ash-site-chi.vercel.app --canonical https://www.aisolutionhouse.com --assets --out reports/site-audit.json
```

Son kontrolün kapsamı ve sonuçları `reports/site-audit.md` içindedir.

## Anasayfa videosu

"Neler Yapıyoruz" bölümündeki animasyon `public/videos/ash-motion-3.mp4` (H.264, 1440×824,
30 fps, 5 sn döngü). Yalnızca kurdele hareket eder; kutular ve ASH dairesi sabittir.
Zemini bölümün gri şeridine **gömülüdür** — tarayıcıların şeffaf video desteği tutarsız
olduğu için (Safari WebM alfa kanalını göstermez) şeffaflık yerine zemin rengi videoya işlendi.

Video `scripts/ash-motion.py` ile üretilir. Kaynak olarak aynı animasyonun beyaz ve siyah
zeminli iki çıktısı gerekir (Python + numpy + ffmpeg):

```bash
python3 scripts/ash-motion.py beyaz.mp4 siyah.webm public/videos/ash-motion-4.mp4
```

Betik iki iş yapar:
- **Gri zemine bindirme:** iki çıktının farkından her pikselin saydamlığı bulunur ve sonuç
  bölme yapmadan hesaplanır. (Saydamlığa bölmek sıkıştırma gürültüsünü parıltı kenarlarında
  büyütüyordu; bu yüzden kullanılmıyor.)
- **Beyaz halenin silinmesi:** kutuların çevresindeki yarı saydam **beyaz** parıltı beyaz
  zeminde görünmüyordu ama gri zeminde halka olarak çıkıyordu. Yarı saydam ve beyaz pikseller
  zemine eritilir; opak kutu gövdeleri ve **renkli** parıltılar korunur.
- **Dış beyaz şeridin silinmesi:** kutuların dış kenarında tam opak beyaz bir parıltı şeridi
  var; saydamlığı ~1 olduğu için formül onu kutu yüzünden ayıramaz. Kutu yüzü renkli bir
  kenarla çevrili, şerit ise boş zemine değiyor: zeminden yalnız beyaz pikseller üzerinden
  en fazla 14 px ilerleyerek ulaşılan bant silinir. Kurdelenin parlak yansımalarına dokunmamak
  için bu adım yalnız sabit bölgede (kutular, ASH dairesi) uygulanır.
- Kaynak 25 fps / 6 sn; çıktı aynı 150 kareyi 30 fps'te oynatır (%20 hızlı, kare atlanmaz).

Video nötr gri `#f6f6f6` üzerine kodlanır ve bu bölümün şeridi de `#f6f6f6`'dır
(`src/app/brand.css`; diğer gri şeritler `#f5f5f7`). Nötr gri seçildi çünkü `#f5f5f7`'nin
hafif mavisi 8-bit 4:2:0 videoda tutarlı temsil edilemiyor ve tarayıcılar renk matrisini
farklı varsayabiliyor; nötr grinin sonucu matristen bağımsızdır. Bu şerit iki yanından beyaz
bölümlerle çevrili, diğer gri şeritlerle yan yana gelmez. Şeridin rengi değişirse video
yeniden üretilmelidir.
Yeni videoyu **yeni bir adla** kaydedip `WhatWeDoSection.assets.json` içindeki yolu ve
`.gitignore`'daki istisnayı güncelleyin (`public/videos` 30 gün önbelleklenir).

Video yalnızca kullanıcı "hareketi azalt" ayarını açmamışsa oynar
(`src/components/theme/home/MotionVideo.tsx`); aksi halde ilk kare poster olarak kalır.
Sayfa açılırken inmez (`preload="none"`): ekrana 100px kala yüklenip oynar, ekrandan
çıkınca durur. Video ilk ekranda olmadığı için anasayfanın ilk yükünü ~1 MB azaltır.

## Blog yönetimi

Panel `/admin/giris` adresindedir. Yerel geliştirmede `.env.local`, Vercel'de
Production/Preview ortamları için `.env.example` içindeki iki Supabase değişkeni gerekir.
Secret veya service-role anahtarı kullanılmaz.

İlk kurulumda Supabase Authentication'da yönetici oluşturulur, ardından SQL Editor'de
`supabase/setup.sql` ve `supabase/bilingual-blog.sql` sırayla çalıştırılır.
Mevcut kurulumu güncellerken yalnızca `supabase/bilingual-blog.sql` yeterlidir.

Her blog yazısı tek editörde Türkçe ve English sekmelerinden hazırlanır. Başlık, adres,
özet, içerik ve SEO alanları her dil için ayrıdır. Yeni yüklenen kapak, tarih ve okuma
süresi iki dil için ortaktır. “İki dilde yayınla” iki sürümü tek veritabanı işlemiyle
kaydeder; eksik içerikte veya eski sürümle kayıt denemesinde hiçbir sürüm değişmez.
Taslağa alma ve silme de iki dili birlikte etkiler. Yeni bir yazının yalnızca Türkçe
başlığı ve metni hazırsa önce taslak kaydedilebilir; İngilizce sürüm aynı editörde eklenir.

Doğrulama: `npm run check` ve
`node --test tests/cms-validation.test.mjs tests/cms-bilingual.test.mjs`.
