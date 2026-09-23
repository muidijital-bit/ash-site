import { requireAdmin } from "@/lib/cms/auth";
import { PostList } from "@/components/admin/PostList";
import type { CmsPost } from "@/lib/cms/types";
export const metadata = { title: "Blog yazıları" };
export default async function PostsPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("ash_blog_posts").select("*").order("updated_at", { ascending: false });
  if (error) throw new Error("Yazılar yüklenemedi.");
  return <PostList posts={data as CmsPost[]} />;
}
