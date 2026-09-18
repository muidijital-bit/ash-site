"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, type MouseEvent, type ReactNode } from "react";
import { brand } from "@/content/brand";
import { VideoModal } from "./VideoModal";
import { getPageTheme } from "./theme";
import "./SiteFrame.css";

export function SiteFrame({ children, header, footer }: { children: ReactNode; header: ReactNode; footer: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const theme = getPageTheme(pathname);
  const [video, setVideo] = useState<{ pathname: string; trigger: HTMLElement } | null>(null);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest<HTMLButtonElement>(
      ".Hero_content__Q0Yei button, [data-open-brand-video]",
    );
    if (!button) return;
    // Tanitim videosu tanimli degilse bos bir video penceresi acmak yerine
    // ziyaretciyi urunlere goturuyoruz (brand.videoUrl doldurulunca video acilir).
    if (!brand.videoUrl) {
      router.push("/products");
      return;
    }
    setVideo({ pathname, trigger: button });
  };

  return (
    <div id="site-root" data-page-theme={theme} onClick={handleClick}>
      {/* Klavye ve ekran okuyucu kullanicilari menuyu atlayip icerige gecebilsin. */}
      <a className="ash-skip-link" href="#ana-icerik">İçeriğe geç</a>
      {header}
      <div id="ana-icerik" tabIndex={-1}>{children}</div>
      {footer}
      {video?.pathname === pathname && <VideoModal trigger={video.trigger} onClose={() => setVideo(null)} />}
    </div>
  );
}
