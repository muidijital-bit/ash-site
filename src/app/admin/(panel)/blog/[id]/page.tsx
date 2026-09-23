import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/cms/auth";
import { PostEditor } from "@/components/admin/PostEditor";
import type { CmsPost } from "@/lib/cms/types";
export const metadata = { title: "Yazıyı düzenle" };
export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const { data, error } = await supabase.from("ash_blog_posts").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error("Yazı yüklenemedi.");
  if (!data) notFound();
  const post = data as CmsPost;
  const { data: versions, error: versionsError } = await supabase.from("ash_blog_posts").select("*").eq("translation_key", post.translation_key);
  if (versionsError) throw new Error("Dil sürümleri yüklenemedi.");
  return <PostEditor key={post.translation_key} posts={(versions ?? []) as CmsPost[]} initialLocale={post.locale} translationKey={post.translation_key} />;
}
