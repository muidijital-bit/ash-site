# Yayın ve domain bağlantısı

Site Vercel'de çalışır. Cloudflare yalnızca DNS yönetimi için kullanılır.

- GitHub: https://github.com/muidijital-bit/ash-site (herkese açık)
- Üretim dalı: `main`
- Vercel: `muidijital-1026s-projects` hesabındaki `ash-site`
- Geçici site adresi: https://ash-site-chi.vercel.app
- Asıl adres: https://www.aisolutionhouse.com
- Yönetim paneli: `/admin/giris`

## Otomatik yayın

`main` dalına gönderilen her commit Vercel'de üretim dağıtımı başlatır. Vercel'in
Deployments ekranından commit ve Ready durumu kontrol edilir. Başarısız bir derleme
mevcut çalışan dağıtımın yerini almaz. Ayrı bir GitHub Actions dağıtım anahtarı gerekmez.

Yerelde kod değişikliği doğrulaması:

```bash
npm ci
npm run check
node --test tests/*.test.mjs
```

Vercel Node.js sürümü `24.x`, framework Next.js'tir. Üretim ve önizleme ortamlarında
`NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` tanımlıdır.
Üretim `NEXT_PUBLIC_NOINDEX=0` kullanır; site adresinin varsayılanı
`https://www.aisolutionhouse.com` olur. `*.vercel.app` adresleri ayrıca
`X-Robots-Tag: noindex, follow` alır. Yönetim sayfaları indekslenmez.

İletişim formu için `RESEND_API_KEY` gerekir ([aşağıda](#iletişim-formu-resend)).

`.env.local` ve `.vercel` Git'e dahil değildir. Supabase secret/service-role anahtarı
uygulamanın çalışması için gerekmez ve depoya eklenmemelidir.

## Cloudflare DNS

23 Eylül 2026'da Vercel API'nin bu proje için önerdiği kayıtlar:

| Tür | Ad | Değer | Proxy |
| --- | --- | --- | --- |
| A | `@` | `216.198.79.1` | DNS only |
| A | `@` | `64.29.17.1` | DNS only |
| CNAME | `www` | `3ab4531e30db9ceb.vercel-dns-017.com` | DNS only |

Google e-posta MX, SPF ve `google._domainkey` DKIM kayıtları korunur. Eski Squarespace
web IP'leri ve `www` hedefi yeni kayıtlara yerini bırakır. Vercel HTTPS sertifikasını
ve site dağıtımını yönetir; Cloudflare proxy'si bu web kayıtlarında kapalıdır.

## Nameserver geçişi (23 Eylül 2026'da tamamlandı)

Alan adı Squarespace Domains'te kayıtlı kalır; yalnızca DNS Cloudflare'e taşındı.

1. Squarespace → Domains → aisolutionhouse.com → DNS → DNSSEC kapatıldı. Squarespace
   imzalamayı hemen bıraktı, `.com` DS kaydı ise yaklaşık iki dakika sonra silindi; bu
   arada DNSSEC doğrulayan çözümleyiciler (8.8.8.8, 9.9.9.9) alan adı için kısa süre
   SERVFAIL verdi.
2. Aynı ekranda Domain Nameservers → "Use Custom Nameservers" ile
   `cash.ns.cloudflare.com` ve `janet.ns.cloudflare.com` girildi. Eski
   `nse*.squarespacedns.com` kayıtları elle silinemez; kaydedince devre dışı kalır.
   `.com` kaydı 23:03'te (TSİ) Cloudflare'e geçti.
3. Vercel iki alan adının Let's Encrypt sertifikasını yaklaşık 10 dakika sonra aldı.

Vercel alan adını doğrulayıp sertifikayı alana kadar `/` ve `/blog` gibi proxy'de
yeniden yazılan (rewrite) adresler dış istek gibi işlendi: geçişten önce eski
Squarespace sayfasını, geçiş sırasında HTTP'de kendine yönlenen bir döngü gösterdi.
Doğrulamadan sonra kendiliğinden düzeldi; kod değişikliği gerekmedi.

Geçişte doğrulananlar: iki alan adında geçerli HTTPS; `http://` ve `aisolutionhouse.com`
isteklerinin `https://www.aisolutionhouse.com` adresine 308 yönlenmesi; TR/EN sayfalar,
blog, yönetim paneli, 404 sayfası, `robots.txt`, `sitemap.xml` (tüm adresler `www`),
canonical/hreflang etiketleri ve og:image. Gmail MX, SPF ve DKIM kayıtları değişmedi.

Kontrol komutları:

```bash
dig +short NS aisolutionhouse.com
dig +short DS aisolutionhouse.com
dig +short A aisolutionhouse.com
dig +short CNAME www.aisolutionhouse.com
curl -I https://aisolutionhouse.com
curl -I https://www.aisolutionhouse.com
```

DNSSEC şu an kapalıdır. İstenirse Cloudflare → DNS → Settings → DNSSEC açılır ve
Cloudflare'in verdiği **yeni** DS kaydı Squarespace'in DNSSEC ekranına girilir.

## İletişim formu (Resend)

Form, sunucuda çalışan bir Server Action (`src/app/[lang]/contact/actions.ts`) ile
Resend API'sine istek atar. Mail `hello@aisolutionhouse.com` adresine gider, gönderen
`AI Solution House <form@aisolutionhouse.com>` olur ve yanıt adresi (reply-to) ziyaretçinin
e-postasıdır: gelen mail Gmail'de doğrudan yanıtlanabilir. `RESEND_API_KEY` yoksa ya da
gönderim başarısız olursa form bunu ziyaretçiye söyler ve yazılanları tarayıcıda saklar.

Kurulum:

1. resend.com'da hesap açın → **Domains → Add Domain** → `aisolutionhouse.com`.
2. Resend'in verdiği DNS kayıtlarını Cloudflare'e ekleyin ("Auto configure" ile
   Cloudflare'e giriş yapıp tek tıkla eklenebilir). Kayıtlar `resend._domainkey` (DKIM)
   ve `send` alt alanındaki MX/SPF kayıtlarıdır; kök alan adının Google MX kaydına
   dokunulmaz. Proxy kapalı ("DNS only") olmalı. Resend ekranında alan adı **Verified**
   olana kadar bekleyin.
3. **API Keys → Create API Key**: yetki "Sending access", alan adı `aisolutionhouse.com`.
4. Vercel → ash-site → Settings → **Environment Variables**: `RESEND_API_KEY` adıyla
   Production ve Preview ortamlarına ekleyin. İsteğe bağlı: `CONTACT_TO_EMAIL`
   (virgülle ayrılmış birden fazla alıcı olabilir; tanımlıysa varsayılan `hello@`
   adresinin yerine geçer, bu yüzden `hello@` de listeye yazılır), `CONTACT_FROM_EMAIL`.
5. Değişkenler yeni dağıtımda geçerli olur: Deployments → son dağıtım → **Redeploy**.

Kontrol: formu sitede doldurup gönderin; "mesajınız bize ulaştı" yazmalı ve mail
`hello@` kutusuna düşmelidir. Gelmezse Resend → **Emails** ekranında gönderim ve
Vercel → Logs ekranında `[iletisim]` ile başlayan satırlar hatanın nedenini gösterir.

## Google Analytics (onaya bağlı)

`NEXT_PUBLIC_GA_ID` (GA4 ölçüm kimliği, `G-…`) tanımlanınca sayfanın altında çerez onay
şeridi çıkar; Analytics yalnızca "Kabul et" denirse yüklenir, onaydan önce Google'a istek
gitmez. Reklam ve kişiselleştirme izinleri kapalıdır. Seçim tarayıcıda saklanır, footer'daki
"Çerez tercihleri" şeridi yeniden açar; onay geri alınınca `_ga` çerezleri silinir.
Kod: `src/components/consent/`. Çerez, gizlilik ve KVKK metinleri bu davranışı anlatır;
kimlik kaldırılırsa metinler de güncellenmelidir.

Kurulum: analytics.google.com → Yönetici → Mülk oluştur → Web veri akışı
(`https://www.aisolutionhouse.com`, "Gelişmiş ölçüm" açık kalsın: sayfa geçişleri buradan
sayılır) → ölçüm kimliğini Vercel'de `NEXT_PUBLIC_GA_ID` olarak Production'a ekleyin ve
yeniden dağıtın (değişken derleme sırasında okunur).

Kaynaklar: [Vercel domain kurulumu](https://vercel.com/docs/domains/set-up-custom-domain),
[Vercel Git entegrasyonu](https://vercel.com/docs/git),
[Cloudflare nameserver geçişi](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/).
