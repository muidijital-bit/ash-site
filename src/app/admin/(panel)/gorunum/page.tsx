import { requireAdmin } from "@/lib/cms/auth";
import { BrandEditor } from "@/components/admin/BrandEditor";
import { defaultBrandSettings, type BrandSettings } from "@/lib/cms/types";
export const metadata = { title: "Logo ve favicon" };
export default async function BrandPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("ash_site_settings").select("settings").eq("id", "site").single();
  if (error) throw new Error("Görünüm ayarları okunamadı.");
  return <BrandEditor initial={{ ...defaultBrandSettings, ...data.settings } as BrandSettings} />;
}
