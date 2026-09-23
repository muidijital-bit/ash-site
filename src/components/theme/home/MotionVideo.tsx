"use client";

import { useEffect, useRef } from "react";

/**
 * Anasayfadaki "Neler Yapiyoruz" animasyonu.
 *
 * autoPlay kullanilmiyor: video yalnizca kullanici hareketi azaltmayi
 * secmemisse JS ile baslatiliyor. JS yoksa ya da hareket azaltma aciksa
 * poster (ilk kare) sabit gorsel olarak kalir.
 *
 * Video ilk ekranda degil; preload="none" ile sayfa acilirken inmez (1 MB,
 * anasayfanin ilk yukunun %77'siydi). Ekrana 100px kala yuklenip oynar,
 * ekrandan cikinca durur. Pay bilerek kucuk: 300px'te telefonda video ilk
 * ekranin hemen altinda kaldigi icin metin uzunluguna gore (TR/EN) bazen
 * yine sayfa acilirken iniyordu. Yuklenirken poster (ilk kare) gorunur.
 *
 * Videonun zemini bolumun gri seridine gomulu (tarayicida #f6f6f6); seridin
 * rengi degisirse video yeniden uretilmeli (bkz. README, "Anasayfa videosu").
 */
export function MotionVideo({ src, poster, className }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    const sync = () => {
      if (media.matches) {
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
    media.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", sync);
    };
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      width={1440}
      height={824}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
