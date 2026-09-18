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

| Yol | İçerik |
| --- | --- |
| `/` | Anasayfa |
| `/products` · `/products/[slug]` | Ürün ailesi ve dört ürün sayfası |
| `/our-dna` | Neden ASH |
| `/news` · `/news/[slug]` | Blog |
| `/contact` | İletişim |
| `/legal/[slug]` | Gizlilik, KVKK, çerez metinleri |

## İçerik nerede

Metinler koddan ayrı durur; bileşene dokunmadan değiştirilebilir.

```
src/content/
  brand.ts            marka adı, logo, tanıtım videosu
  contact.ts          e-posta, telefon, adres, şirket unvanı   ← doldurulacak
  products.ts         ürün listesi (nav, dizin ve kartları besler)
  product-pages/      dört ürün sayfasının metni
  blog/               blog yazıları
  legal/              yasal metinler

src/components/theme/**/*.content.json    tema bölümlerinin metinleri
src/components/theme/**/*.assets.json     tema bölümlerinin görselleri
```

## Yayına çıkmadan önce

1. **`NEXT_PUBLIC_SITE_URL`'i tanımlayın.** Tanımlı değilken site arama motorlarına
   kapalıdır (`robots.txt` ve `noindex` bu değişkene bağlı) ve canonical adresler
   `localhost` olur. Örnek için `.env.example`.
2. **`src/content/contact.ts`'i doldurun.** Boş alanlar sayfada "Yakında eklenecek"
   olarak görünür ve yasal metinlerde `[şirket unvanı]` gibi işaretler çıkar.
3. **İletişim formunu bir servise bağlayın.** Şu an form ve bülten kaydı hiçbir yere
   gönderim yapmaz; yalnızca tarayıcıda taslak tutarlar ve bunu kullanıcıya bildirirler.
4. **Yasal metinleri hukukçuya okutun.** `src/content/legal/` altındaki üç metin taslaktır.
5. **`output: "standalone"`** — `next.config.ts` içindeki nota bakın. Vercel'e çıkacaksanız
   kaldırın; Docker'a çıkacaksanız `public/` ve `.next/static`'i elle kopyalayın.

## Notlar

- Tema CSS'i `public/theme/css` altındadır ve **değiştirilmez**; marka uyarlamaları
  `src/app/brand.css` ve `src/app/globals.css` içinde override olarak yazılır.
- Görseller kod ile çizilmiş SVG veya boyutu düşürülmüş WebP'dir; stok fotoğraf kullanılmaz.
