import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";
import { supabaseConfig } from "@/lib/supabase/config";
export const metadata = { title: "Giriş" };
export default function LoginPage() {
  return (
    <main className="admin-login">
      <div className="admin-login__brand">
        <Link href="/">
          <img src="/brand/ash-dark.svg" width="100" height="41" alt="ASH ana sayfa" />
        </Link>
        <span>İçerik yönetimi</span>
      </div>
      <section className="admin-login__card">
        <span className="admin-eyebrow">ASH YÖNETİM</span>
        <h1>Giriş yap</h1>
        <LoginForm configured={!!supabaseConfig()} />
        <Link className="admin-back" href="/">← Siteye dön</Link>
      </section>
      <p className="admin-login__foot">AI Solution House · Yönetim paneli</p>
    </main>
  );
}
