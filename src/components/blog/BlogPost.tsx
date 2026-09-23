import { getBrandSettings } from "@/lib/cms/public";
import { MarkdownBody } from "./MarkdownBody";
import Link from "next/link";
import Image from "next/image";
import type { BlogPost as Post } from "@/content/blog/types";
import { localePath, type Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import { SITE_URL } from "@/content/site";
import { jsonLdString } from "@/lib/seo";

export function formatDate(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(getUi(locale).dateLocale, { day: "numeric", month: "long", year: "numeric" })
    .format(new Date(`${iso}T00:00:00`));
}

/** Arama motorlari icin makale ve SSS semasi. */
async function JsonLd({ post, locale }: { post: Post; locale: Locale }) {
  const settings = await getBrandSettings();
  const article = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    url: `${SITE_URL}${locale === "en" ? "/en" : ""}/blog/${post.slug}`,
    mainEntityOfPage: `${SITE_URL}${locale === "en" ? "/en" : ""}/blog/${post.slug}`,
    image: new URL(post.cover, SITE_URL).toString(),
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: post.author.name },
    publisher: {
      "@type": "Organization", name: "AI Solution House", url: SITE_URL,
      logo: { "@type": "ImageObject", url: new URL(settings.logoLight, SITE_URL).toString() },
    },
    articleSection: post.category,
    inLanguage: getUi(locale).blog.inLanguage,
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(faq) }} />
    </>
  );
}

export function BlogPost({ post, locale }: { post: Post; locale: Locale }) {
  const { blog } = getUi(locale);
  return (
    <main className="blog">
      <JsonLd post={post} locale={locale} />

      {/* Koyu ust bant: header bunun uzerinde duruyor. */}
      <header className="blog-band">
        <div className="blog-wrap">
          <p className="blog-cat">{post.category}</p>
          <h1 className="blog-title">{post.title}</h1>
          <p className="blog-meta">
            <span>{post.author.name}</span>
            <span>
              <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
            </span>
            <span>{blog.readingTime(post.readingMinutes)}</span>
          </p>
        </div>
      </header>

      <article className="blog-wrap blog-article">
        {/* Kapak gorseli kod ile cizilmis SVG; stok fotograf kullanilmiyor. */}
        <Image className="blog-cover" src={post.cover} alt={post.coverAlt ?? ""} width={1200} height={600} sizes="(min-width: 64rem) 960px, calc(100vw - 48px)" loading="eager" />

        <div className="blog-body">
          {post.bodyMarkdown !== undefined ? <MarkdownBody content={post.bodyMarkdown} /> : <>
          {post.intro.map((p, i) => (
            <p key={p} className={i === 0 ? "blog-lead" : undefined}>{p}</p>
          ))}

          {post.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.paragraphs.map((p) => <p key={p}>{p}</p>)}
            </section>
          ))}
          </>}
        </div>

        {post.takeaways.length > 0 && (
          <section className="blog-sum blog-body">
            <h2>{blog.takeaways}</h2>
            <ul>
              {post.takeaways.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </section>
        )}

        {post.faq.length > 0 && (
          <section className="blog-faq blog-body">
            <h2>{blog.faq}</h2>
            {post.faq.map((f) => (
              <div key={f.q}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </section>
        )}

        <footer className="blog-foot">
          <Link href={localePath(locale, "/blog")}>{blog.allPosts}</Link>
          <span className="blog-foot__note">
            {blog.talkBefore}<Link href={localePath(locale, "/contact")}>{blog.talkLink}</Link>{blog.talkAfter}
          </span>
        </footer>
      </article>
    </main>
  );
}
