"use client";
import { useId, useState, useTransition } from "react";
import { uploadMediaAction } from "@/app/admin/actions";

export function MediaUpload({ value, onChange, kind, label, dark = false, onBusyChange }: { value: string; onChange: (url: string) => void; kind: "cover" | "logo" | "favicon"; label: string; dark?: boolean; onBusyChange?: (busy: boolean) => void }) {
  const id = useId();
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  return <div className={`admin-upload admin-upload--${kind}`}><span className="admin-field-title">{label}</span><div className={`admin-upload__preview${dark ? " admin-upload__preview--dark" : ""}`}>{value ? <img src={value} alt={`${label} önizleme`} /> : <span>Görsel ekleyin</span>}</div><label htmlFor={id} className="admin-button admin-button--secondary">{pending ? "Yükleniyor…" : value ? "Görseli değiştir" : "Görsel yükle"}</label><input id={id} className="admin-file-input" type="file" accept="image/png,image/jpeg,image/webp,image/avif" disabled={pending} onChange={event => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";
    setError(""); onBusyChange?.(true);
    const form = new FormData(); form.set("file", file); form.set("kind", kind);
    start(async () => { try { const result = await uploadMediaAction(form); if (result.error) setError(result.error); else if (result.url) onChange(result.url); } catch { setError("Yükleme tamamlanamadı. Bağlantınızı kontrol edin."); } finally { onBusyChange?.(false); } });
  }} /><small>{kind === "favicon" ? "Kare PNG önerilir. " : kind === "logo" ? "Şeffaf PNG önerilir. " : "1200 × 600 px önerilir. "}PNG, JPG, WebP, AVIF · En fazla 3 MB</small>{error && <p className="admin-message admin-message--error" role="alert">{error}</p>}</div>;
}
