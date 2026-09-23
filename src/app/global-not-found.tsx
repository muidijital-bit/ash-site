import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { HeaderMarkup } from "@/components/theme/shared/HeaderMarkup";
import { FooterMarkup } from "@/components/theme/shared/FooterMarkup";
import { SiteFrame } from "@/components/theme/shared/SiteFrame";
import { defaultLocale, hasLocale, localePath } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import "./globals.css";
import "./brand.css";
import "@/components/blog/blog.css";

/* Eslesmeyen adresler: kok layout dile gore ayrildigi icin 404 sayfasi
   burada tam bir HTML belgesi olarak uretilir. Dil, proxy'nin ekledigi
   baslikta gelir. */
export const metadata: Metadata = { robots: { index: false, follow: true } };

export default async function GlobalNotFound() {
  const header = (await headers()).get("x-ash-locale") ?? defaultLocale;
  const locale = hasLocale(header) ? header : defaultLocale;
  const ui = getUi(locale);
  const links: [string, string][] = [
    ["/", ui.nav.home],
    ["/products", ui.nav.products],
    ["/why-ash", ui.nav.why],
    ["/blog", ui.nav.blog],
    ["/contact", ui.nav.contact],
  ];
  return (
    <html lang={locale}>
      <head>
        <title>{`${ui.notFound.metaTitle} — AI Solution House`}</title>
        {/* Kok layout atlandigi icin tema stilleri burada yuklenir. */}
        <link rel="stylesheet" href="/theme/css/65b096ee3798f49e-9605c14cc6.css" precedence="base" />
        <link rel="stylesheet" href="/theme/css/653b5fc3396b8f10-19b9ef9de6.css" precedence="page" />
      </head>
      <body>
        <SiteFrame locale={locale} header={<HeaderMarkup locale={locale} />} footer={<FooterMarkup locale={locale} />}>
        <main className="blog">
          <header className="blog-band">
            <div className="blog-wrap">
              <p className="blog-cat">404</p>
              <h1 className="blog-title">{ui.notFound.title}</h1>
              <p className="blog-meta"><span>{ui.notFound.meta}</span></p>
            </div>
          </header>
          <article className="blog-wrap blog-article">
            <div className="blog-body">
              <p className="blog-lead">{ui.notFound.lead}</p>
              <ul className="legal-list">
                {links.map(([path, label]) => (
                  <li key={path}><Link href={localePath(locale, path)}>{label}</Link></li>
                ))}
              </ul>
            </div>
          </article>
        </main>
        </SiteFrame>
      </body>
    </html>
  );
}
