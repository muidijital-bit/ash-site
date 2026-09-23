import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/cms/auth";
import { PostEditor } from "@/components/admin/PostEditor";
import { notFound, redirect } from "next/navigation";
export const metadata = { title: "Yeni yazı" };
export default async function NewPost({ searchParams }: { searchParams: Promise<{ lang?: string; translation?: string }> }) {
  const { supabase } = await requireAdmin();
  const query = await searchParams;
  const locale = query.lang === "en" ? "en" : "tr";
  if (query.translation) {
    const { data } = await supabase.from("ash_blog_posts").select("id,locale,translation_key").eq("translation_key", query.translation);
    if (!data?.length) notFound();
    redirect(`/admin/blog/${data.find(p => p.locale === locale)?.id ?? data[0].id}`);
  }
  return <PostEditor posts={[]} initialLocale={locale} translationKey={randomUUID()} />;
}
