import Link from "next/link";
import type { BlogPost as Post } from "@/content/blog/types";
import "./blog.css";

const DATE_FMT = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" });

export function formatDate(iso: string) {
  return DATE_FMT.format(new Date(`${iso}T00:00:00`));
}

/** Arama motorlari icin makale ve SSS semasi. */
function JsonLd({ post }: { post: Post }) {
  const article = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    image: post.cover,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: post.author.name },
    publisher: { "@type": "Organization", name: "AI Solution House" },
    articleSection: post.category,
    inLanguage: "tr-TR",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  );
}

export function BlogPost({ post }: { post: Post }) {
  return (
    <main className="blog">
      <JsonLd post={post} />

      {/* Koyu ust bant: header bunun uzerinde duruyor. */}
      <header className="blog-band">
        <div className="blog-wrap">
          <p className="blog-cat">{post.category}</p>
          <h1 className="blog-title">{post.title}</h1>
          <p className="blog-meta">
            <span>{post.author.name}</span>
            <span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </span>
            <span>{post.readingMinutes} dk okuma</span>
          </p>
        </div>
      </header>

      <article className="blog-wrap blog-article">
        {/* Kapak gorseli kod ile cizilmis SVG; stok fotograf kullanilmiyor. */}
        <img className="blog-cover" src={post.cover} alt="" width={1200} height={600} />

        <div className="blog-body">
          {post.intro.map((p, i) => (
            <p key={p} className={i === 0 ? "blog-lead" : undefined}>{p}</p>
          ))}

          {post.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.paragraphs.map((p) => <p key={p}>{p}</p>)}
            </section>
          ))}
        </div>

        {post.takeaways.length > 0 && (
          <section className="blog-sum blog-body">
            <h2>Özetle</h2>
            <ul>
              {post.takeaways.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </section>
        )}

        {post.faq.length > 0 && (
          <section className="blog-faq blog-body">
            <h2>Sık sorulan sorular</h2>
            {post.faq.map((f) => (
              <div key={f.q}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </section>
        )}

        <footer className="blog-foot">
          <Link href="/news">← Tüm yazılar</Link>
          <span className="blog-foot__note">
            Bu konuyu konuşmak için <Link href="/contact">bize yazın</Link>.
          </span>
        </footer>
      </article>
    </main>
  );
}
