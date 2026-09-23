import { OG_CONTENT_TYPE, OG_SIZE, ogCard, ogClamp } from "@/components/og/card";
import { getPost, getPosts } from "@/content/blog";
import { defaultLocale, hasLocale } from "@/i18n/config";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AI Solution House";

/** Her dil kendi slug'lariyla uretilir. */
export async function generateStaticParams({ params }: { params: { lang: string } }) {
  return hasLocale(params.lang) ? (await getPosts(params.lang)).map((post) => ({ slug: post.slug })) : [];
}

export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const locale = hasLocale(lang) ? lang : defaultLocale;
  const post = await getPost(locale, slug);
  return ogCard({
    locale,
    eyebrow: post?.category ?? "Blog",
    title: ogClamp(post?.title ?? "", 78),
    note: ogClamp(post?.summary ?? "", 120),
  });
}
