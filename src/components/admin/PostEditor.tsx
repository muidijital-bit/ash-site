"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import type { CmsPost } from "@/lib/cms/types";
import { postInputSchema, type PostInput } from "@/lib/cms/validation";
import { makeEditorValues, prepareBilingualInput } from "@/lib/cms/editor";
import type { Locale } from "@/i18n/config";
import { savePostAction, deletePostAction } from "@/app/admin/actions";
import { MediaUpload } from "./MediaUpload";
import { MarkdownBody } from "@/components/blog/MarkdownBody";

function slugify(text: string) { return text.toLocaleLowerCase("tr").replace(/ı/g, "i").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 140).replace(/-$/, ""); }
export function PostEditor({ posts, initialLocale, translationKey }: { posts: CmsPost[]; initialLocale: Locale; translationKey: string }) {
  const router = useRouter();
  const [values, setValues] = useState(() => makeEditorValues(posts, translationKey));
  const [saved, setSaved] = useState(() => JSON.stringify(makeEditorValues(posts, translationKey)));
  const [activeLocale, setActiveLocale] = useState<Locale>(initialLocale);
  const value = values[activeLocale];
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const dirty = saved !== JSON.stringify(values);
  const hasSavedPost = !!(values.tr.id || values.en.id);
  const anyPublished = values.tr.status === "published" || values.en.status === "published";
  const bothPublished = values.tr.status === "published" && values.en.status === "published";
  const c = value.content;
  function field<K extends keyof PostInput["content"]>(key: K, next: PostInput["content"][K]) {
    setValues(current => ({ ...current, [activeLocale]: { ...current[activeLocale], content: { ...current[activeLocale].content, [key]: next } } }));
    setMessage("");
  }
  function sharedField<K extends keyof PostInput["content"]>(key: K, next: PostInput["content"][K]) {
    setValues(current => ({
      tr: { ...current.tr, content: { ...current.tr.content, [key]: next } },
      en: { ...current.en, content: { ...current.en.content, [key]: next } },
    }));
    setMessage("");
  }
  useEffect(() => {
    if (!dirty) return;
    const leave = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    const navigate = (e: MouseEvent) => {
      const anchor = e.target instanceof Element ? e.target.closest("a") : null;
      if (!anchor || anchor.target === "_blank" || anchor.origin !== location.origin || anchor.pathname === location.pathname) return;
      if (!confirm("Kaydedilmemiş değişiklikler var. Bu sayfadan ayrılmak istiyor musunuz?")) { e.preventDefault(); e.stopPropagation(); }
    };
    window.addEventListener("beforeunload", leave); document.addEventListener("click", navigate, true);
    return () => { window.removeEventListener("beforeunload", leave); document.removeEventListener("click", navigate, true); };
  }, [dirty]);
  function save(status: PostInput["status"]) {
    setError(""); setMessage("");
    start(async () => {
      try {
        const result = await savePostAction(prepareBilingualInput(values, status));
        if (result.error) {
          setError(result.error);
          if (result.locale) setActiveLocale(result.locale);
          return;
        }
        if (!result.posts) return;
        const next = makeEditorValues(result.posts, translationKey);
        setValues(next); setSaved(JSON.stringify(next));
        setMessage(status === "published" ? "Yazınız Türkçe ve İngilizce olarak yayında." : "Taslak kaydedildi. Yazının iki dil sürümü de yayında değil.");
        if (!hasSavedPost) router.replace(`/admin/blog/${next[activeLocale].id ?? next.tr.id ?? next.en.id}`); else router.refresh();
      } catch { setError("Kaydetme tamamlanamadı. Bağlantınızı kontrol edip tekrar deneyin."); }
    });
  }
  function insert(prefix: string, suffix = "") {
    const el = bodyRef.current; if (!el) return;
    const text = c.bodyMarkdown ?? ""; const start = el.selectionStart; const end = el.selectionEnd;
    field("bodyMarkdown", text.slice(0, start) + prefix + (text.slice(start, end) || "metin") + suffix + text.slice(end));
    el.focus();
  }
  const publicPath = `${value.locale === "en" ? "/en" : ""}/blog/${c.slug}`;
  return <><header className="admin-page-head"><div><Link href="/admin/blog" className="admin-back">← Blog yazıları</Link><h1>{hasSavedPost ? "Yazıyı düzenle" : "Yeni bir yazı"}</h1><p>Türkçe + English · <span className={`admin-badge admin-badge--${bothPublished ? "published" : "draft"}`}>{bothPublished ? "İki dilde yayında" : anyPublished ? "Tek dil yayında" : "Taslak"}</span>{dirty && <span className="admin-unsaved">Kaydedilmemiş değişiklikler</span>}</p></div><div className="admin-actions"><button type="button" className="admin-button admin-button--secondary" disabled={pending || uploading} onClick={() => save("draft")}>{pending ? "Kaydediliyor…" : anyPublished ? "İki dili taslağa al" : "Taslak kaydet"}</button><button type="button" className="admin-button admin-button--primary" disabled={pending || uploading} onClick={() => save("published")}>{pending ? "Kaydediliyor…" : "İki dilde yayınla →"}</button></div></header>
    {error && <p className="admin-message admin-message--error" role="alert">{error}</p>}{message && <p className="admin-message admin-message--success" role="status">{message}</p>}
    <div className="admin-language-bar"><div className="admin-language-tabs" role="tablist" aria-label="Yazı dili" onKeyDown={e => { if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) { e.preventDefault(); const next = e.key === "Home" ? "tr" : e.key === "End" ? "en" : activeLocale === "tr" ? "en" : "tr"; setActiveLocale(next); document.getElementById(`language-tab-${next}`)?.focus(); } }}>
      {(["tr", "en"] as const).map(language => {
        const ready = postInputSchema.safeParse({ ...values[language], status: "published" }).success;
        return <button key={language} type="button" id={`language-tab-${language}`} role="tab" aria-selected={activeLocale === language} aria-controls="language-editor" tabIndex={activeLocale === language ? 0 : -1} disabled={pending || uploading} onClick={() => { setActiveLocale(language); setTab("write"); }}><span>{language === "tr" ? "Türkçe" : "English"}</span><small>{ready ? "Hazır" : "Tamamlanacak"}</small></button>;
      })}
    </div><p>İki dilin metnini de hazırlayın; tek düğmeyle birlikte yayınlayın.</p></div>
    <div id="language-editor" role="tabpanel" aria-labelledby={`language-tab-${activeLocale}`}>
    <fieldset disabled={pending || uploading} className="admin-editor-fieldset"><div className="admin-editor-grid"><div className="admin-editor-main"><section className="admin-card admin-form admin-card--pad"><label>Yazı başlığı<input value={c.title} maxLength={180} onChange={e => field("title", e.target.value)} onBlur={() => { if (!value.id && !c.slug) field("slug", slugify(c.title)); }} placeholder="Paylaşmak istediğiniz fikir…" className="admin-title-input" /></label><label>Yazı adresi<div className="admin-slug"><span>{value.locale === "en" ? "/en/blog/" : "/blog/"}</span><input aria-label="Yazı adresi" value={c.slug} readOnly={!!value.id} onChange={e => field("slug", e.target.value)} placeholder="yazi-basligi" maxLength={140} /></div><small>{value.id ? "Mevcut bağlantıların korunması için adres sabittir." : "Başlıktan otomatik oluşturulur; ilk kayıttan önce değiştirebilirsiniz."}</small></label><label>Kısa özet<textarea value={c.summary} onChange={e => field("summary", e.target.value)} onBlur={() => { if (!c.metaDescription) field("metaDescription", c.summary.slice(0, 160)); }} rows={3} maxLength={700} placeholder="Blog listesinde görünecek kısa açıklama." /></label><div className="admin-editor-tabs" role="tablist" aria-label="İçerik görünümü"><button type="button" role="tab" aria-selected={tab === "write"} onClick={() => setTab("write")}>Yazı içeriği</button><button type="button" role="tab" aria-selected={tab === "preview"} onClick={() => setTab("preview")}>Önizleme</button></div>{tab === "write" ? <><div className="admin-toolbar"><button type="button" onClick={() => insert("**", "**")} aria-label="Kalın metin"><b>B</b></button><button type="button" onClick={() => insert("*", "*")} aria-label="İtalik metin"><i>I</i></button><button type="button" onClick={() => insert("\n\n## ")} aria-label="Alt başlık">H2</button><button type="button" onClick={() => insert("\n- ")} aria-label="Liste ekle">☷ Liste</button><button type="button" onClick={() => insert("[", "](https://)")} aria-label="Bağlantı ekle">↗ Bağlantı</button></div><label><span className="admin-sr-only">Yazı içeriği</span><textarea ref={bodyRef} value={c.bodyMarkdown} onChange={e => field("bodyMarkdown", e.target.value)} className="admin-body-editor" placeholder="Yazmaya başlayın…\n\nAlt başlık için ##, kalın metin için **metin** kullanabilirsiniz." /></label></> : <div className="admin-prose admin-preview" role="tabpanel" aria-label="Yazı önizlemesi"><span className="admin-eyebrow">{c.category}</span><h2>{c.title || "Yazı başlığı"}</h2>{c.cover && <img src={c.cover} alt={c.coverAlt ?? ""} />}<MarkdownBody content={c.bodyMarkdown || "İçerik eklediğinizde önizleme burada görünür."} /></div>}</section>
    <details className="admin-card admin-card--pad admin-optional"><summary>Öne çıkanlar ve sık sorulan sorular</summary><div className="admin-form"><label>Öne çıkanlar<small>Her maddeyi ayrı satıra yazın.</small><textarea rows={4} value={c.takeaways.join("\n")} onChange={e => field("takeaways", e.target.value.split("\n"))} /></label>{c.faq.map((faq, i) => <div className="admin-faq-edit" key={i}><label>Soru {i + 1}<input value={faq.q} onChange={e => field("faq", c.faq.map((f, n) => n === i ? { ...f, q: e.target.value } : f))} /></label><label>Yanıt<textarea rows={3} value={faq.a} onChange={e => field("faq", c.faq.map((f, n) => n === i ? { ...f, a: e.target.value } : f))} /></label><button type="button" className="admin-text-button" onClick={() => field("faq", c.faq.filter((_, n) => n !== i))}>Soruyu kaldır</button></div>)}<button type="button" className="admin-button admin-button--secondary" onClick={() => field("faq", [...c.faq, { q: "", a: "" }])}>+ Soru ekle</button></div></details>
    <details className="admin-card admin-card--pad admin-optional"><summary>SEO ayarları</summary><div className="admin-form"><label>Arama sonucu başlığı<input value={c.seoTitle ?? ""} maxLength={100} onChange={e => field("seoTitle", e.target.value)} placeholder={c.title} /><small>Boş bırakılırsa yazı başlığı kullanılır.</small></label><label>Meta açıklama<textarea value={c.metaDescription} maxLength={200} rows={3} onChange={e => field("metaDescription", e.target.value)} /><small>{c.metaDescription.length}/200 karakter · Yaklaşık 140–160 karakter önerilir.</small></label><div className="admin-search-preview"><small>www.aisolutionhouse.com{publicPath}</small><strong>{c.seoTitle || c.title || "Yazı başlığı"} | ASH</strong><p>{c.metaDescription || "Arama sonuçlarında görünecek açıklama."}</p></div></div></details></div>
    <aside className="admin-editor-side"><section className="admin-card admin-card--pad admin-form"><h2>Yazı bilgileri</h2><label>Kategori<input value={c.category} onChange={e => field("category", e.target.value)} placeholder="Örn. Kurumsal Yapay Zekâ" maxLength={80} /></label><label>Yayın tarihi<input type="date" value={c.date} onChange={e => sharedField("date", e.target.value)} /></label><label>Okuma süresi (dakika)<input type="number" min={1} max={120} value={c.readingMinutes} onChange={e => sharedField("readingMinutes", Number(e.target.value))} /></label><label>Yazar<input value={c.author.name} onChange={e => field("author", { ...c.author, name: e.target.value })} maxLength={100} /></label>{value.id && value.status === "published" && <a className="admin-text-button" href={publicPath} target="_blank" rel="noopener noreferrer">{activeLocale === "tr" ? "Türkçe yazıyı görüntüle" : "İngilizce yazıyı görüntüle"} ↗</a>}</section><section className="admin-card admin-card--pad admin-form"><MediaUpload label="Kapak görseli" onBusyChange={setUploading} value={c.cover} onChange={url => sharedField("cover", url)} /><small>Yüklediğiniz kapak görseli iki dilde de kullanılır.</small><label>Görsel açıklaması<input value={c.coverAlt ?? ""} onChange={e => field("coverAlt", e.target.value)} maxLength={250} placeholder="Görselde ne olduğunu açıklayın." /></label></section>{hasSavedPost && (confirmDelete ? <section className="admin-card admin-card--pad admin-form"><p className="admin-muted">Bu yazının Türkçe ve İngilizce sürümleri kalıcı olarak silinecek.</p><button type="button" disabled={pending || uploading} className="admin-delete" onClick={() => {
      start(async () => {
        try {
          const versions = [values.tr, values.en].filter(p => p.id).map(p => ({ id: p.id!, version: p.version }));
          const result = await deletePostAction(versions);
          if (result.error) setError(result.error);
          else { setSaved(JSON.stringify(values)); router.push("/admin/blog"); router.refresh(); }
        } catch { setError("Silme işlemi tamamlanamadı. Lütfen tekrar deneyin."); }
      });
    }}>Evet, iki dilde sil</button><button type="button" disabled={pending || uploading} className="admin-button admin-button--secondary" onClick={() => setConfirmDelete(false)}>Vazgeç</button></section> : <button type="button" disabled={pending || uploading} className="admin-delete" onClick={() => setConfirmDelete(true)}>Yazıyı iki dilde sil</button>)}</aside></div></fieldset></div></>;
}
