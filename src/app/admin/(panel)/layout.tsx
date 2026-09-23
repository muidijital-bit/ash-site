import Link from "next/link";
import { requireAdmin } from "@/lib/cms/auth";
import { logoutAction } from "../actions";
import { AdminNav } from "@/components/admin/AdminNav";
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();
  return <div className="admin-shell"><aside className="admin-sidebar"><Link href="/admin/blog" className="admin-brand"><img src="/brand/ash-dark.svg" width="86" height="36" alt="ASH" /><span>Yönetim paneli</span></Link><AdminNav /><div className="admin-sidebar__bottom"><a href="/" target="_blank" rel="noopener noreferrer">Siteyi görüntüle ↗</a><p title={user.email}>{user.email}</p><form action={logoutAction}><button className="admin-signout">Çıkış yap</button></form></div></aside><main className="admin-main" id="admin-content">{children}</main></div>;
}
