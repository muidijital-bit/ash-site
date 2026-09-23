import { z } from "zod";

const text = (max: number) => z.string().trim().max(max);
export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Adres yalnızca küçük harf, rakam ve tire içermeli.").max(140);
export const postInputSchema = z.object({
  id: z.uuid().optional(),
  version: z.number().int().nonnegative(),
  locale: z.enum(["tr", "en"]),
  translation_key: z.string().regex(/^[a-z0-9-]{1,160}$/),
  status: z.enum(["draft", "published"]),
  content: z.object({
    slug: slugSchema,
    title: text(180).min(3, "Başlık en az 3 karakter olmalı."),
    seoTitle: text(100).optional(),
    metaDescription: text(200),
    category: text(80),
    summary: text(700),
    readingMinutes: z.number().int().min(1).max(120),
    date: z.iso.date(),
    author: z.object({ name: text(100).min(1), role: text(100) }),
    intro: z.array(text(10000)).max(100),
    sections: z.array(z.object({ heading: text(250), paragraphs: z.array(text(10000)).max(100) })).max(100),
    takeaways: z.array(text(1000)).max(30),
    faq: z.array(z.object({ q: text(400), a: text(4000) })).max(30),
    cover: text(1000),
    coverAlt: text(250).optional(),
    bodyMarkdown: z.string().max(150000).optional(),
  }),
}).superRefine((post, ctx) => {
  if (post.status !== "published") return;
  const c = post.content;
  for (const [field, value, message] of [
    ["summary", c.summary, "Yayına almadan önce kısa özeti ekleyin."],
    ["metaDescription", c.metaDescription, "Yayına almadan önce SEO açıklamasını ekleyin."],
    ["category", c.category, "Yayına almadan önce kategori ekleyin."],
    ["cover", c.cover, "Yayına almadan önce kapak görseli yükleyin."],
    ["bodyMarkdown", c.bodyMarkdown?.trim() || c.intro.join(""), "Yayına almadan önce yazı içeriğini ekleyin."],
  ]) if (!value) ctx.addIssue({ code: "custom", path: ["content", field], message });
  if (c.faq.some(f => !f.q.trim() || !f.a.trim())) ctx.addIssue({ code: "custom", path: ["content", "faq"], message: "Sık sorulan sorular bölümündeki eksik soru veya yanıtı tamamlayın." });
  if (c.date > new Date().toISOString().slice(0, 10)) ctx.addIssue({ code: "custom", path: ["content", "date"], message: "İleri tarihli yayın yerine taslak olarak kaydedin." });
});

export type PostInput = z.infer<typeof postInputSchema>;

export const bilingualPostInputSchema = z.object({
  status: z.enum(["draft", "published"]),
  posts: z.array(postInputSchema).min(1).max(2),
}).superRefine((pair, ctx) => {
  if (new Set(pair.posts.map(post => post.locale)).size !== pair.posts.length
    || new Set(pair.posts.map(post => post.translation_key)).size !== 1
    || pair.posts.some(post => post.status !== pair.status)) {
    ctx.addIssue({ code: "custom", path: ["posts"], message: "Dil sürümleri aynı yazıya ait olmalı." });
  }
  if (pair.status === "published" && pair.posts.length !== 2) {
    ctx.addIssue({ code: "custom", path: ["posts"], message: "Yayınlamak için Türkçe ve İngilizce metinleri tamamlayın." });
  }
});

export const deletePostPairSchema = z.array(z.object({
  id: z.uuid(),
  version: z.number().int().positive(),
})).min(1).max(2);

export type BilingualPostInput = z.infer<typeof bilingualPostInputSchema>;

export function validMediaPath(value: string, supabaseUrl?: string) {
  if (!value) return true;
  if (/^\/(images|brand|theme)\/[a-zA-Z0-9._/-]+$/.test(value) && !value.includes("..")) return true;
  if (!supabaseUrl) return false;
  try {
    const url = new URL(value);
    return !url.username && !url.password && url.origin === new URL(supabaseUrl).origin && url.pathname.startsWith("/storage/v1/object/public/ash-media/") && !url.search && !url.hash;
  } catch { return false; }
}
