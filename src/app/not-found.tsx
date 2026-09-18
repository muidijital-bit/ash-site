import type { Metadata } from "next";
import Link from "next/link";
import "@/components/blog/blog.css";

export const metadata: Metadata = {
  title: "Sayfa bulunamadı",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      {/* Header, menu ve footer stilleri tema CSS'inde sayfa dosyalarina gomulu. */}
      <link rel="stylesheet" href="/theme/css/653b5fc3396b8f10-19b9ef9de6.css" precedence="page" />
      <main className="blog">
        <header className="blog-band">
          <div className="blog-wrap">
            <p className="blog-cat">404</p>
            <h1 className="blog-title">Aradığınız sayfa burada değil</h1>
            <p className="blog-meta">
              <span>Adres değişmiş ya da sayfa kaldırılmış olabilir.</span>
            </p>
          </div>
        </header>

        <article className="blog-wrap blog-article">
          <div className="blog-body">
            <p className="blog-lead">Buradan devam edebilirsiniz:</p>
            <ul className="legal-list">
              <li><Link href="/">Anasayfa</Link></li>
              <li><Link href="/products">Ürünler</Link></li>
              <li><Link href="/our-dna">Neden ASH</Link></li>
              <li><Link href="/news">Blog</Link></li>
              <li><Link href="/contact">İletişim</Link></li>
            </ul>
          </div>
        </article>
      </main>
    </>
  );
}
