"use client";

import Link from "next/link";

/* Browser-extracted source design; editable copy/assets live beside this component. */
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { brand } from "@/content/brand";
import { BrandLogo } from "./BrandLogo";
import { lockPageScroll } from "./lockPageScroll";
import { getPageTheme, themeClasses } from "./theme";
import content from "./HeaderMarkup.content.json";
import { products } from "@/content/products";

export function HeaderMarkup() {
  const pathname = usePathname();
  const theme = getPageTheme(pathname);
  const [openPath, setOpenPath] = useState<string | null>(null);
  const isOpen = openPath === pathname;
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [productsOpen, setProductsOpen] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);

  // Urunler acilir listesi: disariya tiklayinca ve Escape ile kapanir.
  useEffect(() => {
    if (!productsOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return;
      if (!productsRef.current?.contains(event.target)) setProductsOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProductsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [productsOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const unlock = lockPageScroll();
    const desktop = window.matchMedia("(min-width: 64rem)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpenPath(null);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpenPath(null);
        menuButtonRef.current?.focus();
      }
      if (event.key !== "Tab") return;
      const controls = Array.from(
        headerRef.current?.querySelectorAll<HTMLElement>("a[href], button") ?? [],
      ).filter((element) => element.getClientRects().length > 0);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    desktop.addEventListener("change", closeOnDesktop);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      unlock();
      desktop.removeEventListener("change", closeOnDesktop);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);
  return (<>
    <header ref={headerRef} className={themeClasses("Header_header__omCkM Header_header--theme-dark__ELG6D", theme)}><div className="Header_header__container__3CAEl"><div className="Header_header__static-container__i3bnO"><Link aria-label={`${brand.name} ana sayfa`} onClick={() => setOpenPath(null)} className="Logo_logo__Ov_7Y" href="/"><BrandLogo className={themeClasses("Logo_logo--variant-dark__tSnF7 Logo_logo__logo__mSktt", theme)} /></Link><button ref={menuButtonRef} type="button" className={`${themeClasses("MenuButton_menu-button__yeeiB MenuButton_menu-button--variant-dark__Zj2ui", theme)}${isOpen ? " MenuButton_menu-button--open__P_dOs" : ""}`} aria-label="Menüyü aç veya kapat" aria-expanded={isOpen} aria-controls="theme-navigation" onClick={() => setOpenPath(isOpen ? null : pathname)}><span className="MenuButton_menu-button__line__pxoEp"></span><span className="MenuButton_menu-button__line__pxoEp"></span></button></div><div id="theme-navigation" className={`NavMenu_nav-menu__7FTtk${isOpen ? " NavMenu_nav-menu--open__GmntU" : ""}`} onClick={(event) => { if (event.target instanceof Element && event.target.closest("a")) { setOpenPath(null); setProductsOpen(false); } }}><nav aria-label="Ana menü" className="NavMenu_nav__zEkWZ"><Link className={themeClasses("NavLink_nav-link__i4vnc NavLink_nav-link--variant-default__JFDLS NavLink_nav-link--theme-dark__b93qe", theme)} href="/" aria-current={pathname === "/" ? "page" : undefined}><span className="NavLink_nav-link__title-container__6oq4A"><span className={themeClasses("NavLink_nav-link__title-text__zzfMl NavLink_nav-link__title-text--theme-dark__Ne0bN", theme)}>{content.text_011}</span></span></Link><div className="ash-products-menu" ref={productsRef} data-open={productsOpen ? "true" : undefined}><button type="button" className={`${themeClasses("NavLink_nav-link__i4vnc NavLink_nav-link--variant-default__JFDLS NavLink_nav-link--theme-dark__b93qe", theme)} ash-products-menu__trigger`} aria-expanded={productsOpen} aria-controls="ash-products-panel" onClick={() => setProductsOpen((v) => !v)}><span className="NavLink_nav-link__title-container__6oq4A"><span className={themeClasses("NavLink_nav-link__title-text__zzfMl NavLink_nav-link__title-text--theme-dark__Ne0bN", theme)}>{content.text_001}</span></span><svg className="ash-products-menu__chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button><div id="ash-products-panel" className="ash-products-menu__panel" hidden={!productsOpen}><Link className="ash-products-menu__all" href="/products">Tüm ürünler</Link>{products.map((product) => (<Link key={product.slug} className="ash-products-menu__item" href={`/products/${product.slug}`}><span className="ash-products-menu__name">{product.name}</span><span className="ash-products-menu__title">{product.title}</span><span className="ash-products-menu__summary">{product.summary}</span></Link>))}</div></div><Link className={themeClasses("NavLink_nav-link__i4vnc NavLink_nav-link--variant-default__JFDLS NavLink_nav-link--theme-dark__b93qe", theme)} href="/our-dna" aria-current={pathname === "/our-dna" ? "page" : undefined}><span className="NavLink_nav-link__title-container__6oq4A"><span className={themeClasses("NavLink_nav-link__title-text__zzfMl NavLink_nav-link__title-text--theme-dark__Ne0bN", theme)}>{content.text_006}</span></span></Link><Link className={themeClasses("NavLink_nav-link__i4vnc NavLink_nav-link--variant-default__JFDLS NavLink_nav-link--theme-dark__b93qe", theme)} href="/news" aria-current={pathname.startsWith("/news") ? "page" : undefined}><span className="NavLink_nav-link__title-container__6oq4A"><span className={themeClasses("NavLink_nav-link__title-text__zzfMl NavLink_nav-link__title-text--theme-dark__Ne0bN", theme)}>{content.text_009}</span></span></Link><Link className={themeClasses("NavLink_nav-link__i4vnc NavLink_nav-link--variant-default__JFDLS NavLink_nav-link--theme-dark__b93qe", theme)} href="/contact" aria-current={pathname === "/contact" ? "page" : undefined}><span className="NavLink_nav-link__title-container__6oq4A"><span className={themeClasses("NavLink_nav-link__title-text__zzfMl NavLink_nav-link__title-text--theme-dark__Ne0bN", theme)}>{content.text_010}</span></span></Link></nav></div></div></header>
  </>);
}
