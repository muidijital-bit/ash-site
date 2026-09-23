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
node --test tests/cms-validation.test.mjs tests/cms-bilingual.test.mjs
```

Vercel Node.js sürümü `24.x`, framework Next.js'tir. Üretim ve önizleme ortamlarında
`NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` tanımlıdır.
Üretim `NEXT_PUBLIC_NOINDEX=0` kullanır; site adresinin varsayılanı
`https://www.aisolutionhouse.com` olur. `*.vercel.app` adresleri ayrıca
`X-Robots-Tag: noindex, follow` alır. Yönetim sayfaları indekslenmez.

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

## Akşam yapılacak nameserver geçişi

1. Domainin kayıt firmasındaki **DNSSEC'i kapatın**. Mevcut DNSSEC DS kaydı kaldırılmadan
   nameserver değiştirmeyin; eski imza zinciri yeni DNS sunucularıyla uyuşmaz.
2. Eski dört `nse*.squarespacedns.com` nameserver kaydını şu ikisiyle değiştirin:
   - `cash.ns.cloudflare.com`
   - `janet.ns.cloudflare.com`
3. Cloudflare alan adı durumu **Active**, Vercel Domains ekranındaki iki alan adı
   **Valid Configuration** olduktan sonra HTTPS ve yönlendirmeleri kontrol edin.

Nameserver değişimi 23 Eylül'deki hazırlık sırasında yapılmadı. Bu değişimden önce
canlı domainin eski siteyi göstermesi beklenir. E-posta ayarları değiştirilmez.

Geçiş kontrolü:

```bash
dig +short NS aisolutionhouse.com
dig +short DS aisolutionhouse.com
dig +short A aisolutionhouse.com
dig +short CNAME www.aisolutionhouse.com
curl -I https://aisolutionhouse.com
curl -I https://www.aisolutionhouse.com
```

Ana domain `www` adresine yönlenmeli; `www`, Türkçe/İngilizce sayfalar, blog ve panel
geçerli HTTPS ile açılmalıdır. `robots.txt` ve `sitemap.xml` asıl domaini göstermelidir.
DNSSEC, geçiş tamamlandıktan sonra Cloudflare'in verdiği **yeni** DS kaydıyla yeniden
etkinleştirilebilir.

Kaynaklar: [Vercel domain kurulumu](https://vercel.com/docs/domains/set-up-custom-domain),
[Vercel Git entegrasyonu](https://vercel.com/docs/git),
[Cloudflare nameserver geçişi](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/).
