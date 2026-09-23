"use client";
import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";
export function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(loginAction, { error: "" });
  return <form action={action} className="admin-form">
    <label>E-posta<input name="email" type="email" required autoComplete="username" placeholder="E-posta adresiniz" /></label>
    <label>Şifre<input name="password" type="password" required autoComplete="current-password" placeholder="Şifreniz" /></label>
    {state.error && <p className="admin-message admin-message--error" role="alert">{state.error}</p>}
    {!configured && <p className="admin-message">Supabase bağlantısı hazırlanıyor. Kurulum tamamlanınca giriş açılacak.</p>}
    <button className="admin-button admin-button--primary" disabled={pending || !configured}>{pending ? "Giriş yapılıyor…" : "Giriş yap →"}</button>
  </form>;
}
