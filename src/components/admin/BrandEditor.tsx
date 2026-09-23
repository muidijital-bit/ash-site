"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { defaultBrandSettings, type BrandSettings } from "@/lib/cms/types";
import { saveBrandAction } from "@/app/admin/actions";
import { MediaUpload } from "./MediaUpload";
export function BrandEditor({ initial }: { initial: BrandSettings }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const [uploading, setUploading] = useState(false);
  return <><header className="admin-page-head"><div><span className="admin-eyebrow">GÖRÜNÜM</span><h1>Logo ve favicon</h1><p>Sitenizin imzasını güncelleyin. Değişiklikler kaydettiğinizde yayınlanır.</p></div><button className="admin-button admin-button--primary" disabled={pending || uploading} onClick={() => { setError(""); setMessage(""); start(async () => { try { const result = await saveBrandAction(value); if (result.error) setError(result.error); else { setMessage("Görünüm ayarları kaydedildi. Logo ve favicon siteye yansıtıldı."); router.refresh(); } } catch { setError("Kaydetme tamamlanamadı. Lütfen tekrar deneyin."); } }); }}>{pending ? "Kaydediliyor…" : "Değişiklikleri kaydet"}</button></header>{message && <p className="admin-message admin-message--success" role="status">{message}</p>}{error && <p className="admin-message admin-message--error" role="alert">{error}</p>}<fieldset disabled={pending || uploading} className="admin-editor-fieldset"><div className="admin-brand-grid">{[{ key: "logoLight" as const, title: "Açık zemin logosu", kind: "logo" as const, dark: false, description: "Beyaz ve açık renkli alanlarda kullanılan logo." }, { key: "logoDark" as const, title: "Koyu zemin logosu", kind: "logo" as const, dark: true, description: "Koyu renkli alanlarda kullanılan açık renk logo." }, { key: "favicon" as const, title: "Favicon", kind: "favicon" as const, dark: false, description: "Tarayıcı sekmesinde görünen küçük simge." }].map(item => <section className="admin-card admin-card--pad admin-form" key={item.key}><MediaUpload label={item.title} kind={item.kind} onBusyChange={setUploading} dark={item.dark} value={value[item.key]} onChange={url => { setValue(current => ({ ...current, [item.key]: url })); setMessage(""); }} /><p className="admin-muted">{item.description}</p><button type="button" className="admin-text-button" onClick={() => setValue(current => ({ ...current, [item.key]: defaultBrandSettings[item.key] }))}>Mevcut ASH görseline dön</button></section>)}</div></fieldset><p className="admin-note">Favicon tarayıcınızda kısa süre önbellekte kalabilir. Değişikliği yeni bir sekmede kontrol edebilirsiniz.</p></>;
}
