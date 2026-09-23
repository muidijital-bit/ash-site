"use client";
import Link from "next/link";
import { useState } from "react";
import type { CmsPost } from "@/lib/cms/types";

export function PostList({ posts }: { posts: CmsPost[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [translation, setTranslation] = useState("all");
  const grouped = new Map<string, CmsPost[]>();
  for (const post of posts) grouped.set(post.translation_key, [...(grouped.get(post.translation_key) ?? []), post]);
  const groups = [...grouped.values()].map(versions => ({
    versions,
    post: versions.find(p => p.locale === "tr") ?? versions[0],
    anyPublished: versions.some(p => p.status === "published"),
    bothPublished: versions.length === 2 && versions.every(p => p.status === "published"),
  }));
  const filtered = groups.filter(group =>
    (status === "all" || (status === "published" ? group.anyPublished : !group.anyPublished))
    && (translation === "all" || (translation === "complete" ? group.versions.length === 2 : group.versions.length !== 2))
    && group.versions.some(p => `${p.content.title} ${p.content.category}`.toLocaleLowerCase("tr").includes(search.toLocaleLowerCase("tr"))),
  );
  return <>
    <header className="admin-page-head">
      <div><span className="admin-eyebrow">İÇERİK</span><h1>Blog yazıları<span className="admin-count">{groups.length}</span></h1><p>Türkçe ve İngilizce metinleri tek yazıda hazırlayın, birlikte yayınlayın.</p></div>
      <Link href="/admin/blog/yeni" className="admin-button admin-button--primary">+ Yeni yazı</Link>
    </header>
    <div className="admin-stats">
      <div><span>Toplam yazı</span><strong>{groups.length}</strong></div>
      <div><span>Yayında</span><strong>{groups.filter(g => g.anyPublished).length}</strong></div>
      <div><span>Taslak</span><strong>{groups.filter(g => !g.anyPublished).length}</strong></div>
    </div>
    <section className="admin-card">
      <div className="admin-filters">
        <label className="admin-search"><span className="admin-sr-only">Yazı ara</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Başlık veya kategori ara…" type="search" /></label>
        <label><span className="admin-sr-only">Yayın durumu</span><select value={status} onChange={e => setStatus(e.target.value)}><option value="all">Tüm durumlar</option><option value="published">Yayında</option><option value="draft">Taslak</option></select></label>
        <label><span className="admin-sr-only">Dil sürümleri</span><select value={translation} onChange={e => setTranslation(e.target.value)}><option value="all">Tüm diller</option><option value="complete">İki dil mevcut</option><option value="missing">Çeviri eksik</option></select></label>
      </div>
      <div className="admin-posts">{filtered.map(({ post, versions, anyPublished, bothPublished }) =>
        <Link key={post.translation_key} href={`/admin/blog/${post.id}`} className="admin-post">
          <div className="admin-post__cover">{post.content.cover ? <img src={post.content.cover} alt="" loading="lazy" /> : <span aria-hidden="true">✎</span>}</div>
          <div className="admin-post__text"><span className="admin-post__category">{post.content.category || "Kategorisiz"}</span><h2>{post.content.title}</h2><p>{post.content.summary || "Henüz özet eklenmedi."}</p><div className="admin-post__languages">{(["tr", "en"] as const).map(locale => {
            const version = versions.find(p => p.locale === locale);
            return <span key={locale} data-ready={!!version}>{locale.toUpperCase()} · {version ? version.status === "published" ? "Yayında" : "Taslak" : "Eksik"}</span>;
          })}</div></div>
          <div className="admin-post__meta"><span className={`admin-badge admin-badge--${bothPublished ? "published" : "draft"}`}>{bothPublished ? "İki dilde yayında" : anyPublished ? "Tek dil yayında" : "Taslak"}</span><time dateTime={post.content.date}>{new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${post.content.date}T00:00:00`))}</time><span className="admin-edit-link">Düzenle ↗</span></div>
        </Link>,
      )}</div>
      {!filtered.length && <div className="admin-empty"><h2>{posts.length ? "Aramanıza uygun yazı yok." : "İlk yazınızla başlayın."}</h2><p>{posts.length ? "Arama veya filtreleri değiştirin." : "Yeni bir yazı oluşturup taslak olarak kaydedebilirsiniz."}</p></div>}
    </section>
  </>;
}
