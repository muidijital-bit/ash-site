"use server";

import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";
import { supabaseConfig } from "@/lib/supabase/config";
import { requireAdmin } from "@/lib/cms/auth";
import { bilingualPostInputSchema, deletePostPairSchema, validMediaPath } from "@/lib/cms/validation";
import { defaultBrandSettings, type BrandSettings, type CmsPost } from "@/lib/cms/types";

export async function loginAction(_state: { error: string }, form: FormData) {
  if (!supabaseConfig()) return { error: "Supabase bağlantısı henüz tamamlanmadı." };
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || !password || email.length > 254 || password.length > 1000) return { error: "E-posta ve şifrenizi kontrol edin." };
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user || data.user.is_anonymous) return { error: "Giriş yapılamadı. E-posta ve şifrenizi kontrol edin." };
  const { data: admin } = await supabase.from("ash_admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!admin) {
    await supabase.auth.signOut();
    return { error: "Bu hesabın yönetim paneline erişim yetkisi yok." };
  }
  redirect("/admin/blog");
}

export async function logoutAction() {
  const supabase = await createSupabaseServer();
  await supabase.auth.signOut();
  redirect("/admin/giris");
}

function refreshContent() {
  updateTag("ash-cms");
  revalidatePath("/[lang]", "layout");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin", "layout");
}

export async function savePostAction(value: unknown) {
  const { supabase } = await requireAdmin();
  const parsed = bilingualPostInputSchema.safeParse(value);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const index = issue.path[0] === "posts" && typeof issue.path[1] === "number" ? issue.path[1] : null;
    const locale = index !== null && typeof value === "object" && value && "posts" in value && Array.isArray(value.posts) ? value.posts[index]?.locale : undefined;
    const language = locale === "tr" ? "Türkçe: " : locale === "en" ? "İngilizce: " : "";
    return { error: language + issue.message, locale: locale === "tr" || locale === "en" ? locale as "tr" | "en" : undefined };
  }
  const input = parsed.data;
  if (input.posts.some(post => !validMediaPath(post.content.cover, supabaseConfig()?.url))) return { error: "Kapak görselini panelden yükleyin." };
  const { data, error } = await supabase.rpc("ash_save_blog_pair", { posts: input.posts, target_status: input.status });
  if (error) return { error: blogMutationError(error) };
  if (!Array.isArray(data) || data.length !== input.posts.length) return { error: "Kayıt sonucu doğrulanamadı. Sayfayı yenileyin." };
  refreshContent();
  return { posts: data as CmsPost[] };
}

function blogMutationError(error: { code: string; message: string }) {
  if (error.code === "23505") return "Bu yazı adresi zaten kullanılıyor. Henüz kaydedilmemiş dilin adresini değiştirin.";
  if (error.message.includes("ASH_CONFLICT")) return "Bu yazının bir dil sürümü başka bir sekmede değiştirildi. Sayfayı yenileyerek son sürümü açın.";
  if (error.message.includes("ASH_INCOMPLETE_TRANSLATION") || error.message.includes("ASH_BOTH_LANGUAGES_REQUIRED")) return "Yayınlamak için Türkçe ve İngilizce metinleri tamamlayın.";
  if (error.code === "PGRST202") return "İki dilde yayın için Supabase güncellemesi henüz tamamlanmadı.";
  return "İşlem tamamlanamadı. Değişiklikler kaydedilmedi; lütfen tekrar deneyin.";
}

export async function deletePostAction(value: unknown) {
  const { supabase } = await requireAdmin();
  const parsed = deletePostPairSchema.safeParse(value);
  if (!parsed.success) return { error: "Geçersiz yazı." };
  const { error } = await supabase.rpc("ash_delete_blog_pair", { posts: parsed.data });
  if (error) return { error: blogMutationError(error) };
  refreshContent();
  return { success: true };
}

export async function uploadMediaAction(form: FormData) {
  const { supabase, user } = await requireAdmin();
  const file = form.get("file");
  const kind = form.get("kind");
  if (!(file instanceof File) || !file.size || file.size > 3 * 1024 * 1024) return { error: "En fazla 3 MB boyutunda bir görsel seçin." };
  if (!["cover", "logo", "favicon"].includes(String(kind))) return { error: "Geçersiz görsel türü." };
  const bytes = Buffer.from(await file.arrayBuffer());
  let output: Buffer;
  const favicon = kind === "favicon";
  try {
    const source = sharp(bytes, { limitInputPixels: 20_000_000, animated: false });
    const meta = await source.metadata();
    if (!meta.format || !["png", "jpeg", "webp", "avif", "heif"].includes(meta.format)) return { error: "PNG, JPG, WebP veya AVIF dosyası kullanın." };
    if (favicon && meta.width !== meta.height) return { error: "Favicon için kare bir görsel seçin." };
    output = favicon
      ? await source.rotate().resize(256, 256, { fit: "contain", background: "#00000000" }).png().toBuffer()
      : await source.rotate().resize({ width: kind === "logo" ? 1000 : 1600, height: kind === "logo" ? 1000 : 1200, fit: "inside", withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
  } catch { return { error: "Görsel okunamadı. Başka bir PNG, JPG, WebP veya AVIF dosyası deneyin." }; }
  const path = `${user.id}/${randomUUID()}.${favicon ? "png" : "webp"}`;
  const { error } = await supabase.storage.from("ash-media").upload(path, output, { contentType: favicon ? "image/png" : "image/webp", cacheControl: "31536000", upsert: false });
  if (error) return { error: "Görsel yüklenemedi. Supabase dosya alanı ayarını kontrol edin." };
  return { url: supabase.storage.from("ash-media").getPublicUrl(path).data.publicUrl };
}

export async function saveBrandAction(value: BrandSettings) {
  const { supabase } = await requireAdmin();
  const config = supabaseConfig();
  const keys = Object.keys(defaultBrandSettings) as (keyof BrandSettings)[];
  if (!value || keys.some(key => typeof value[key] !== "string" || !value[key] || !validMediaPath(value[key], config?.url))) return { error: "Lütfen görselleri panelden yükleyin." };
  const settings = Object.fromEntries(keys.map(key => [key, value[key]]));
  const { data, error } = await supabase.from("ash_site_settings").update({ settings, updated_at: new Date().toISOString() }).eq("id", "site").select("id").maybeSingle();
  if (error || !data) return { error: "Görünüm ayarları kaydedilemedi." };
  refreshContent();
  return { success: true };
}
