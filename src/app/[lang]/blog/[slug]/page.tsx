import { BlogLanguageLinks } from "@/components/blog/BlogLanguageLinks";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPost } from "@/components/blog/BlogPost";
import { getPost, getPosts } from "@/content/blog";
import { hasLocale, localePath, type Locale } from "@/i18n/config";

export const dynamicParams = true;

/** Her dil kendi slug'lariyla uretilir: /blog/<turkce>, /en/blog/<ingilizce>. */
export async function generateStaticParams({ params }: { params: { lang: string } }) {
  return hasLocale(params.lang) ? (await getPosts(params.lang)).map((post) => ({ slug: post.slug })) : [];
}

export async function generateMetadata({ params }: PageProps<"/[lang]/blog/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const post = await getPost(lang, slug);
  if (!post) return {};
  const metadata = pageMetadata({ locale: lang, path: `/blog/${post.slug}`, title: `${post.seoTitle || post.title} | ASH`, description: post.metaDescription, absolute: true, publishedTime: `${post.date}T00:00:00+03:00` });
  const languages = Object.fromEntries(Object.entries(post.translations ?? {}).map(([language, translatedSlug]) => [language, localePath(language as Locale, `/blog/${translatedSlug}`)]));
  metadata.alternates = { canonical: localePath(lang, `/blog/${post.slug}`), languages: { ...languages, "x-default": languages.tr ?? languages.en } };
  return metadata;
}

export default async function Page({ params }: PageProps<"/[lang]/blog/[slug]">) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const post = await getPost(locale, slug);
  if (!post) notFound();
  return (
    <>
      {/* Header, menu ve footer stilleri tema CSS'inde sayfa dosyalarina gomulu. */}
      <link rel="stylesheet" href="/theme/css/653b5fc3396b8f10-19b9ef9de6.css" precedence="page" />
      <BlogLanguageLinks path={localePath(locale, `/blog/${post.slug}`)} tr={post.translations?.tr ? localePath("tr", `/blog/${post.translations.tr}`) : undefined} en={post.translations?.en ? localePath("en", `/blog/${post.translations.en}`) : undefined} />
      <BlogPost post={post} locale={locale} />
    </>
  );
}
