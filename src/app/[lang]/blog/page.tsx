import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { formatDate } from "@/components/blog/BlogPost";
import { getPosts } from "@/content/blog";
import { hasLocale, localePath, type Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";

export async function generateMetadata({ params }: PageProps<"/[lang]/blog">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { blog } = getUi(lang);
  return pageMetadata({ locale: lang, path: "/blog", title: blog.metaTitle, description: blog.metaDescription });
}

export default async function Page({ params }: PageProps<"/[lang]/blog">) {
  const locale = (await params).lang as Locale;
  const { blog } = getUi(locale);
  return (
    <>
      {/* Header, menu ve footer stilleri tema CSS'inde sayfa dosyalarina gomulu. */}
      <link rel="stylesheet" href="/theme/css/653b5fc3396b8f10-19b9ef9de6.css" precedence="page" />
      <main className="blog blog-index">
        {/* Koyu ust bant: header bunun uzerinde duruyor. */}
        <header className="blog-band">
          <div className="blog-index-wrap blog-index-head">
            <p className="blog-cat">{blog.label}</p>
            <h1>{blog.title}</h1>
            <p>{blog.lead}</p>
          </div>
        </header>

        <div className="blog-index-wrap">
          <div className="blog-list">
            {(await getPosts(locale)).map((post) => (
              <Link key={post.slug} href={localePath(locale, `/blog/${post.slug}`)} className="blog-card">
                {/* Kapak gorseli kod ile cizilmis SVG; stok fotograf kullanilmiyor. */}
                <img className="blog-card__cover" src={post.cover} alt="" width={1200} height={600} />
                <div>
                  <p className="blog-card__cat">{post.category}</p>
                  <h2 className="blog-card__title">{post.title}</h2>
                  <p className="blog-card__summary">{post.summary}</p>
                  <p className="blog-card__meta">
                    <span>
                      <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
                    </span>
                    <span>{blog.readingTime(post.readingMinutes)}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
