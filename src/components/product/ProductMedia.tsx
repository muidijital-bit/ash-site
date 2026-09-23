"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { ProductMedia as Media } from "./media";

/**
 * Urun sayfalarindaki hazir demo gorseli.
 *
 * Videolu kayitlarda autoPlay kullanilmaz (bkz. home/MotionVideo, ayni kural):
 * video yalnizca kullanici hareketi azaltmayi secmemisse ve blok ekrana
 * girdiginde JS ile baslatilir. JS yoksa ya da hareket azaltma aciksa poster
 * sabit gorsel olarak kalir. preload="none" ile sayfa acilirken inmez.
 *
 * Videosuz kayitlarda ayni cerceve duragan gorseli tasir.
 */
export function ProductMedia({ media, locale, className = "", sizes = "(min-width: 80rem) 560px, (min-width: 48rem) 45vw, calc(100vw - 48px)" }: { media: Media; locale: Locale; className?: string; sizes?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const label = media.label[locale];

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    const sync = () => {
      if (motion.matches) {
        video.pause();
        video.currentTime = 0;
      } else if (inView) {
        // Sessiz video otomatik oynatma kuralina takilmaz; yine de reddedilirse poster kalir.
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { rootMargin: "100px 0px" },
    );
    observer.observe(video);
    motion.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", sync);
    };
  }, []);

  const frame = `pp-media ${className}`.trim();

  if (!media.mp4 && !media.webm) {
    return (
      <figure className={frame}>
        <Image src={media.poster} alt={label} width={media.width} height={media.height} sizes={sizes} quality={85} />
      </figure>
    );
  }

  return (
    <figure className={frame}>
      {/* role="img": sessiz, kontrolsuz ve dongulu kayit ekran okuyucuda hareketli bir gorsel gibi duyurulur. */}
      <video
        ref={ref}
        poster={media.poster}
        width={media.width}
        height={media.height}
        muted
        loop
        playsInline
        preload="none"
        role="img"
        aria-label={label}
      >
        {media.webm && <source src={media.webm} type="video/webm" />}
        {media.mp4 && <source src={media.mp4} type="video/mp4" />}
      </video>
    </figure>
  );
}
