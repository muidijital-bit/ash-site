import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: "ASH Yönetim", template: "%s | ASH Yönetim" },
  robots: { index: false, follow: false },
  icons: { icon: "/theme/favicon.svg" },
};

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return <html lang="tr"><body className="admin-body">{children}</body></html>;
}
