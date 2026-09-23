import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { supabaseConfig } from "@/lib/supabase/config";

export const requireAdmin = cache(async () => {
  if (!supabaseConfig()) redirect("/admin/giris");
  const supabase = await createSupabaseServer();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user || user.is_anonymous) redirect("/admin/giris");
  const { data: admin } = await supabase.from("ash_admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/admin/giris?error=yetki");
  return { supabase, user };
});
