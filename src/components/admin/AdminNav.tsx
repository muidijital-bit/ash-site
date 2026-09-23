"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function AdminNav() {
  const pathname = usePathname();
  return <nav className="admin-nav" aria-label="Yönetim menüsü">{[{ href: "/admin/blog", label: "Blog yazıları", icon: "✎" }, { href: "/admin/gorunum", label: "Logo ve favicon", icon: "◈" }].map(item => <Link key={item.href} href={item.href} aria-current={pathname.startsWith(item.href) ? "page" : undefined}><span aria-hidden="true">{item.icon}</span>{item.label}</Link>)}</nav>;
}
