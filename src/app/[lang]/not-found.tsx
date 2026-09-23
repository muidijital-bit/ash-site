import type { Metadata } from "next";
import Link from "next/link";
import { lang } from "next/root-params";
import { defaultLocale, hasLocale, localePath } from "@/i18n/config";
import { getUi } from "@/i18n/ui";

/* not-found parametre almaz; dil kok parametreden okunur. */
async function currentLocale() {
  const value = await lang();
  return value && hasLocale(value) ? value : defaultLocale;
}

export async function generateMetadata(): Promise<Metadata> {
  const { notFound } = getUi(await currentLocale());
  return { title: notFound.metaTitle, robots: { index: false, follow: true } };
}

export default async function NotFound() {
  const locale = await currentLocale();
  const ui = getUi(locale);
  const links: [string, string][] = [
    ["/", ui.nav.home],
    ["/products", ui.nav.products],
    ["/why-ash", ui.nav.why],
    ["/blog", ui.nav.blog],
    ["/contact", ui.nav.contact],
  ];
  return (
    <>
      {/* Header, menu ve footer stilleri tema CSS'inde sayfa dosyalarina gomulu. */}
      <link rel="stylesheet" href="/theme/css/653b5fc3396b8f10-19b9ef9de6.css" precedence="page" />
      <main className="blog">
        <header className="blog-band">
          <div className="blog-wrap">
            <p className="blog-cat">404</p>
            <h1 className="blog-title">{ui.notFound.title}</h1>
            <p className="blog-meta">
              <span>{ui.notFound.meta}</span>
            </p>
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
    </>
  );
}
