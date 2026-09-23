"use client";

import { type ReactNode, useEffect, useRef } from "react";
import type { Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import "./HomeMotion.css";

const disabledClass = "CarouselNavigation_carousel-navigation__button--disabled__M_9lh";
const revealClasses = [
  ["LatestNewsItem_cover__sytL0", "LatestNewsItem_cover--show__gKCIi"],
] as const;

function setupCarousel(carousel: HTMLElement, reducedMotion: MediaQueryList, fallbackLabel: string) {
  const section = carousel.closest("section");
  const slides = Array.from(carousel.querySelectorAll<HTMLElement>(".swiper-slide"));
  const previous = section?.querySelector<HTMLButtonElement>('[id$="-navigation-prev"]');
  const next = section?.querySelector<HTMLButtonElement>('[id$="-navigation-next"]');
  const events = new AbortController();
  const { signal } = events;
  let frame = 0;
  let pointer: { id: number; x: number; y: number; scroll: number } | null = null;
  let dragged = false;

  carousel.tabIndex = 0;
  carousel.setAttribute("role", "region");
  carousel.setAttribute("aria-roledescription", "carousel");
  carousel.setAttribute("aria-label", section?.querySelector("h2")?.textContent || fallbackLabel);
  slides.forEach((slide, index) => {
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-roledescription", "slide");
    slide.setAttribute("aria-label", `${index + 1} / ${slides.length}`);
  });

  const update = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const left = carousel.scrollLeft;
      const maximum = carousel.scrollWidth - carousel.clientWidth;
      [previous, next].forEach((button, index) => {
        if (!button) return;
        const disabled = index === 0 ? left < 2 : left >= maximum - 2;
        button.disabled = disabled;
        button.classList.toggle(disabledClass, disabled);
        button.setAttribute("aria-disabled", String(disabled));
      });
      const offset = carousel.getBoundingClientRect().left;
      let nearest = 0;
      let distance = Infinity;
      slides.forEach((slide, index) => {
        const current = Math.abs(slide.getBoundingClientRect().left - offset);
        if (current < distance) { nearest = index; distance = current; }
      });
      slides.forEach((slide, index) => {
        slide.classList.toggle("swiper-slide-active", index === nearest);
        slide.classList.toggle("swiper-slide-prev", index === nearest - 1);
        slide.classList.toggle("swiper-slide-next", index === nearest + 1);
      });
    });
  };
  const move = (direction: number) => {
    const first = slides[0];
    const second = slides[1];
    const step = first && second ? second.offsetLeft - first.offsetLeft : carousel.clientWidth;
    carousel.scrollBy({ left: step * direction, behavior: reducedMotion.matches ? "instant" : "smooth" });
  };
  previous?.addEventListener("click", () => move(-1), { signal });
  next?.addEventListener("click", () => move(1), { signal });
  carousel.addEventListener("scroll", update, { passive: true, signal });
  carousel.addEventListener("keydown", (event) => {
    if (event.target !== carousel) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      move(event.key === "ArrowRight" ? 1 : -1);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      carousel.scrollTo({ left: event.key === "Home" ? 0 : carousel.scrollWidth, behavior: reducedMotion.matches ? "instant" : "smooth" });
    }
  }, { signal });
  carousel.addEventListener("pointerdown", (event) => {
    // Touch keeps the browser's momentum scrolling and vertical page gestures.
    if (event.pointerType === "touch" || event.button !== 0) return;
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, scroll: carousel.scrollLeft };
    dragged = false;
  }, { signal });
  carousel.addEventListener("pointermove", (event) => {
    if (!pointer || event.pointerId !== pointer.id) return;
    const distance = event.clientX - pointer.x;
    if (!dragged && Math.abs(distance) > 7 && Math.abs(distance) > Math.abs(event.clientY - pointer.y)) {
      dragged = true;
      carousel.setPointerCapture(event.pointerId);
      carousel.dataset.dragging = "true";
    }
    if (dragged) { event.preventDefault(); carousel.scrollLeft = pointer.scroll - distance; }
  }, { signal });
  const release = () => {
    if (pointer && carousel.hasPointerCapture(pointer.id)) carousel.releasePointerCapture(pointer.id);
    pointer = null;
    delete carousel.dataset.dragging;
    update();
  };
  carousel.addEventListener("pointerup", release, { signal });
  carousel.addEventListener("pointercancel", release, { signal });
  carousel.addEventListener("pointerleave", () => { if (!dragged) pointer = null; }, { signal });
  carousel.addEventListener("click", (event) => {
    if (dragged) { event.preventDefault(); event.stopPropagation(); dragged = false; }
  }, { capture: true, signal });
  carousel.addEventListener("dragstart", (event) => event.preventDefault(), { signal });
  const resize = new ResizeObserver(update);
  resize.observe(carousel);
  update();
  return () => { events.abort(); resize.disconnect(); cancelAnimationFrame(frame); };
}

function setupRevenue(root: HTMLElement, reducedMotion: MediaQueryList) {
  const stage = root.querySelector<HTMLElement>(".home-revenue-stage");
  if (!stage) return () => {};
  const desktop = window.matchMedia("(min-width: 64rem)");
  const animations: Animation[] = [];
  let frame = 0;
  const animate = (selector: string, keyframes: Keyframe[]) => {
    const element = stage.querySelector<HTMLElement>(selector);
    if (!element) return;
    const animation = element.animate(keyframes, { duration: 1000, fill: "both", easing: "linear" });
    animation.pause();
    animations.push(animation);
  };
  const update = () => {
    frame = 0;
    const bounds = stage.getBoundingClientRect();
    const artwork = stage.querySelector<HTMLElement>(".overWrap");
    const viewport = artwork?.clientHeight || window.innerHeight;
    const header = artwork ? parseFloat(getComputedStyle(artwork).top) || 0 : 0;
    const progress = Math.max(0, Math.min(1, (header - bounds.top) / Math.max(1, bounds.height - viewport)));
    animations.forEach((animation) => { animation.currentTime = progress * 1000; });
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  const configure = () => {
    animations.splice(0).forEach((animation) => animation.cancel());
    if (!desktop.matches || reducedMotion.matches) { stage.removeAttribute("data-pinned"); return; }
    stage.dataset.pinned = "true";
    animate(".litX", [
      { transform: "translateY(-20%) scale(1.1)", opacity: 1, offset: 0 },
      { transform: "translateY(-45%) scale(1.35)", opacity: 0.15, offset: 0.6 },
      { transform: "translateY(-65%) scale(1.5)", opacity: 0, offset: 1 },
    ]);
    animate(".logoX", [
      { transform: "translateY(-50%)", opacity: 1, offset: 0 },
      { transform: "translateY(-160%)", opacity: 0, offset: 0.5 },
      { transform: "translateY(-160%)", opacity: 0, offset: 1 },
    ]);
    [".ground_chip", ".revenueChipPng", ".revenuechip_clear", ".revenuechip_line", ".revenueChipPng_blur"].forEach((selector) => {
      animate(selector, [
        { transform: "translateY(45%) scale(1.4)", opacity: 0.25, offset: 0 },
        { transform: "translateY(-50%) scale(1)", opacity: 1, offset: 0.65 },
        { transform: "translateY(-50%) scale(1)", opacity: 1, offset: 1 },
      ]);
    });
    [".android_circle", ".apple_circle", ".apple_circle_clear", ".appleandgoogle_lines"].forEach((selector) => {
      animate(selector, [
        { transform: "translateY(-32%) scale(0.8)", opacity: 0, offset: 0 },
        { transform: "translateY(-50%) scale(0.98)", opacity: 1, offset: 0.7 },
        { transform: "translateY(-50%) scale(0.98)", opacity: 1, offset: 1 },
      ]);
    });
    schedule();
  };
  configure();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  desktop.addEventListener("change", configure);
  reducedMotion.addEventListener("change", configure);
  return () => {
    cancelAnimationFrame(frame);
    animations.forEach((animation) => animation.cancel());
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    desktop.removeEventListener("change", configure);
    reducedMotion.removeEventListener("change", configure);
  };
}

/** Enhances the measured server-rendered homepage without changing its content. */
export function HomeMotion({ children, locale }: { children: ReactNode; locale: Locale }) {
  const fallbackLabel = getUi(locale).carouselFallback;
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    revealClasses.forEach(([base, visible]) => {
      root.querySelectorAll(`.${base}`).forEach((element) => element.classList.add(visible));
    });
    const reveals = Array.from(root.querySelectorAll<HTMLElement>('[class*="--show__"]'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) { (target as HTMLElement).dataset.homeReveal = "visible"; observer.unobserve(target); }
      });
    }, { rootMargin: "0px 0px -24px 0px", threshold: 0.05 });
    reveals.forEach((element) => {
      element.dataset.homeReveal = reducedMotion.matches ? "visible" : "pending";
      if (!reducedMotion.matches) observer.observe(element);
    });
    const carousels = Array.from(root.querySelectorAll<HTMLElement>(".swiper"));
    const cleanups = carousels.map((carousel) => setupCarousel(carousel, reducedMotion, fallbackLabel));
    cleanups.push(setupRevenue(root, reducedMotion));
    return () => {
      observer.disconnect();
      reveals.forEach((element) => { delete element.dataset.homeReveal; });
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [fallbackLabel]);
  return <main ref={ref} data-home-motion="">{children}</main>;
}
