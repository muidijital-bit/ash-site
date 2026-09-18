import type { Metadata } from "next";
import Link from "next/link";
import { formatDate } from "@/components/blog/BlogPost";
import { posts } from "@/content/blog";
import "@/components/blog/blog.css";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Kurumsal yapay zekâ, SAP, masraf ve müşteri yönetimi üzerine ASH ekibinin sahadan çıkardığı notlar.",
  alternates: { canonical: "/news" },
};

export default function Page() {
  return (
    <>
      {/* Header, menu ve footer stilleri tema CSS'inde sayfa dosyalarina gomulu. */}
      <link rel="stylesheet" href="/theme/css/653b5fc3396b8f10-19b9ef9de6.css" precedence="page" />
      <main className="blog blog-index">
        {/* Koyu ust bant: header bunun uzerinde duruyor. */}
        <header className="blog-band">
          <div className="blog-index-wrap blog-index-head">
            <p className="blog-cat">Blog</p>
            <h1>Kurumsal yapay zekâya dair saha notları</h1>
            <p>
              Projelerde tekrar tekrar karşımıza çıkan sorular, tıkanma noktaları ve işe yarayan yaklaşımlar.
            </p>
          </div>
        </header>

        <div className="blog-index-wrap">
          <div className="blog-list">
            {posts.map((post) => (
              <Link key={post.slug} href={`/news/${post.slug}`} className="blog-card">
                {/* Kapak gorseli kod ile cizilmis SVG; stok fotograf kullanilmiyor. */}
                <img className="blog-card__cover" src={post.cover} alt="" width={1200} height={600} />
                <div>
                  <p className="blog-card__cat">{post.category}</p>
                  <h2 className="blog-card__title">{post.title}</h2>
                  <p className="blog-card__summary">{post.summary}</p>
                  <p className="blog-card__meta">
                    <span>
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                    </span>
                    <span>{post.readingMinutes} dk okuma</span>
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
