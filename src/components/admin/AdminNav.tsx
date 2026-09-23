"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function AdminNav() {
  const pathname = usePathname();
  return <nav className="admin-nav" aria-label="Yönetim menüsü"><Link href="/admin/blog" aria-current={pathname.startsWith("/admin/blog") ? "page" : undefined}><span aria-hidden="true">✎</span>Blog yazıları</Link></nav>;
}
