"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { SectionItem } from "./types";

/**
 * Kullanim senaryosu sekmeleri.
 * 5 saniyede bir kendiliginden ilerler; kullanici dokundugu anda durur.
 * Klavye: sol/sag/yukari/asagi oklari, Home, End.
 */
export function UseCaseTabs({ items, id, label }: { items: SectionItem[]; id: string; label: string }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (paused || items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((i) => (i + 1) % items.length), 5000);
    return () => window.clearInterval(timer);
  }, [paused, items.length]);

  const select = (i: number) => {
    setPaused(true);
    setActive(i);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = items.length - 1;
    let next = -1;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = active === last ? 0 : active + 1;
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;
    if (next < 0) return;
    event.preventDefault();
    select(next);
    tabsRef.current[next]?.focus();
  };

  return (
    <div className="pp-tabs" onPointerEnter={() => setPaused(true)}>
      <div className="pp-tabs__list" role="tablist" aria-orientation="vertical" onKeyDown={onKeyDown}>
        {items.map((item, i) => (
          <button
            key={item.title}
            ref={(el) => { tabsRef.current[i] = el; }}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            className="pp-tabs__tab"
            onClick={() => select(i)}
          >
            {item.title}
          </button>
        ))}
      </div>
      {/* Tum paneller sunucu HTML'ine girer; JavaScript calismasa da (ve arama
          motorlari icin) butun senaryolarin metni sayfada olur. */}
      {items.map((item, i) => (
        <div
          key={`${i}-${i === active}`}
          className="pp-tabs__panel"
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          hidden={i !== active}
        >
          <p className="pp-label pp-label--sm">{label}</p>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
          <div className="pp-tabs__progress" aria-hidden="true">
            {items.map((step, j) => <i key={step.title} data-on={j <= i ? "" : undefined} />)}
          </div>
        </div>
      ))}
    </div>
  );
}
