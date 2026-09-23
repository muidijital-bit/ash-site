# ASH — SEO, mobil/masaüstü ve görsel kontrolü

Tarih: 23 Eylül 2026

Canlı sürüm: https://ash-site-chi.vercel.app

Dağıtım: `dpl_ARm68gLgPBsd6b7jSLiHfEKzsUVD` — Vercel Production, READY.

## Sonuç

- Türkçe ve İngilizce toplam **32 sayfa** HTTP 200 döndü.
- Otomatik SEO taramasında **0 sorun**: title, meta description, canonical, tek H1,
  dil etiketleri, TR/EN/x-default, Open Graph, Twitter, alt öznitelikleri,
  HTML kimlikleri, sayfa içi bağlantılar ve JSON-LD sözdizimi kontrol edildi.
- **124 kaynak/404 kontrolü** geçti: 120 erişilebilir kaynak (18 paylaşım görseli dahil)
  ve 4 beklenen 404. Bulunamayan sayfalarda doğru dil ve noindex doğrulandı.
- Eski adresler için **5 yönlendirme kontrolü** geçti.
- `npm run check` (ESLint, TypeScript ve üretim derlemesi) hatasız ve uyarısız geçti.

## Mobil ve masaüstü

32 sayfanın her biri 390 px ve 1440 px tarayıcı genişliğinde ölçüldü: toplam
64 kontrol. Sayfa genişliği taşması ve ana metin/form alanlarında yatay taşma yok.
Ana sayfa ayrıca 320 px genişlikte kontrol edildi. Son dağıtımda Masraf-X ve
iletişim sayfalarının yeni görselleri mobilde tekrar incelendi; önizlemede masaüstü
görünümleri de kontrol edildi.

Etkileşim kontrolleri: mobil menü ve dil geçişi, ürün menüsü sıralaması,
ürün sekmeleri, SSS açılması, başa dön düğmesi, ana sayfa ürün düğmesi ve
iletişim formunun boş zorunlu alanları engellemesi. Telefon alanı isteğe bağlı,
`type="tel"` ve otomatik doldurma desteğiyle hazır.

Bu kontroller Chromium tarayıcılarında ekran genişliği değiştirilerek yapıldı;
fiziksel iPhone/Android ve Safari testi yapılmadı. Ölçümler `responsive-audit.json` içinde.

## SEO değişiklikleri

- Canonical, sitemap, hreflang, paylaşım bağlantıları ve yapılandırılmış verilerin
  adresi `https://www.aisolutionhouse.com` olarak ayarlandı.
- Sayfaya özel başlık ve açıklamalar düzenlendi; kısa blog SEO başlıkları eklendi.
  Kullanıcının onayladığı görünür başlıklar korundu.
- Alt sayfalarda ana sayfadan kalan yanlış/eksik Open Graph alanları düzeltildi;
  Twitter kartları ve iki dilin paylaşım bilgileri tamamlandı.
- Tekrarlanan SVG kimlikleri düzeltildi. JSON-LD içeriği güvenli biçimde serileştirildi.
- Production ortamındaki `NEXT_PUBLIC_NOINDEX` değeri `0`; preview ortamı kapalı.
- Canlı Vercel adresindeki 32 sayfanın tamamında `X-Robots-Tag: noindex, follow`
  doğrulandı. Böylece Vercel kopyası arama sonuçlarına alınmaz. Robots dosyası ve
  sayfa metadatası, bağlanacak asıl alan adı için taramaya hazırdır.

## Görsel optimizasyonu

- Ürün görsellerine ekran genişliğine uygun kaynak seçimi, AVIF/WebP ve gecikmeli
  yükleme eklendi. En-boy bilgileri korunarak yükleme sırasında yer ayrıldı.
- İletişim sayfasındaki görsel de aynı boyutlandırma sistemine alındı.
- Üç video kapağı AVIF yapıldı; dosyalar aynı çözünürlükte yaklaşık %45–51 küçüldü.
- Harita için masaüstü ve mobil AVIF sürümleri, WebP yedekleriyle eklendi.
- Altı statik görsel toplamı **869.098 bayttan 527.806 bayta** indi (yaklaşık %39).
  Bu toplam alternatif dosyaları da içerir; tek sayfanın indirme boyutu değildir.
- Canlı örnek: Masraf-X harcama merkezi kaynağı 111.348 bayt; 384 px mobil AVIF
  çıktısı **6.339 bayt**. İletişim görselinin 384 px çıktısı **7.742 bayt**.
- Videoların görünür alanda oynama, ekran dışında durma ve azaltılmış hareket
  tercihine uyma davranışları korundu. Mobilde ilk fiş videosu oynarken aşağıdaki
  video henüz yüklenmemiş durumda doğrulandı.

Dosya ölçümleri `image-optimization.json` ve `image-delivery.json` içinde.
Lighthouse puanı veya gerçek kullanıcı Core Web Vitals ölçümü üretilmedi.

## Kalan bağlantılar

- Kullanıcı alan adını henüz bağlamadı. Vercel/DNS bağlantısını tamamlayacak;
  alan adının canlı HTTPS ve yönlendirme testi bağlantıdan sonra yapılmalı.
- Search Console doğrulaması ve sitemap gönderimi yapılmadı. Gerçek doğrulama
  kodu için `GOOGLE_SITE_VERIFICATION` desteği hazır.
- İletişim formu ve bülten şu anda sunucuya gönderim yapmıyor; tarayıcı taslağı
  kullanıyor ve kullanıcıya bunu bildiriyor. Gerçek kayıt/gönderim bağlantısı,
  sonraki Supabase paneli çalışmasında yapılacak.

Ham canlı tarama: `site-audit.json`. Kontrol komutu README içinde.
