import type { Locale } from "@/i18n/config";
import type { CmsPost } from "./types";
import type { BilingualPostInput, PostInput } from "./validation";

export type EditorValues = Record<Locale, PostInput>;

export function makeEditorValues(posts: CmsPost[], translationKey: string): EditorValues {
  const shared = posts[0]?.content;
  return Object.fromEntries((["tr", "en"] as const).map(locale => {
    const post = posts.find(p => p.locale === locale);
    const content = post?.content ?? {
      slug: "", title: "", seoTitle: "", metaDescription: "", category: "", summary: "",
      readingMinutes: shared?.readingMinutes ?? 3,
      date: shared?.date ?? new Date().toISOString().slice(0, 10),
      author: { name: shared?.author.name ?? "AI Solution House", role: locale === "tr" ? "ASH Ekibi" : "ASH Team" },
      intro: [], sections: [], takeaways: [], faq: [], cover: shared?.cover ?? "", coverAlt: "",
    };
    return [locale, {
      id: post?.id, version: post?.version ?? 0, locale,
      translation_key: translationKey, status: post?.status ?? "draft",
      content: { ...content, bodyMarkdown: content.bodyMarkdown ?? [...content.intro, ...content.sections.map(section => `## ${section.heading}\n\n${section.paragraphs.join("\n\n")}`)].join("\n\n") },
    }];
  })) as EditorValues;
}

export function prepareBilingualInput(values: EditorValues, status: "draft" | "published"): BilingualPostInput {
  const posts = ([values.tr, values.en]).filter(post => {
    const c = post.content;
    return status === "published" || post.id || [c.title, c.slug, c.summary, c.bodyMarkdown, c.category, c.metaDescription, c.seoTitle, c.coverAlt, ...c.takeaways, ...c.faq.flatMap(f => [f.q, f.a])].some(text => text?.trim());
  }).map(post => ({
    ...post, status,
    content: { ...post.content, takeaways: post.content.takeaways.map(t => t.trim()).filter(Boolean), faq: post.content.faq.filter(f => f.q.trim() || f.a.trim()) },
  }));
  // Keep the Turkish form in validation when a completely empty draft is saved.
  return { status, posts: posts.length ? posts : [{ ...values.tr, status }] };
}
