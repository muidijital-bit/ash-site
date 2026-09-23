"use client";
import Link from "next/link";
export default function AdminError({ reset }: { reset: () => void }) {
  return <div className="admin-error"><h1>Bu alan yüklenemedi.</h1><p>Bağlantınızı kontrol edip tekrar deneyin. Kaydedilmemiş değişiklikleri yeniden girmeniz gerekebilir.</p><button className="admin-button admin-button--primary" onClick={reset}>Tekrar dene</button><Link href="/admin/blog">Yazılara dön</Link></div>;
}
