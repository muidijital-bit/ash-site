"use client";

import Link from "next/link";

/* Browser-extracted source design; editable copy/assets live beside this component. */
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { brand } from "@/content/brand";
import { BrandLogo } from "./BrandLogo";
import { lockPageScroll } from "./lockPageScroll";
import { getPageTheme, themeClasses } from "./theme";
import tr from "./HeaderMarkup.content.json";
import en from "./HeaderMarkup.content.en.json";
import { getProducts } from "@/content/products";
import { localePath, splitLocale, type Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import { ProductName } from "@/components/theme/shared/ProductName";
import { MeetingButton } from "@/components/theme/shared/MeetingButton";
import { useBlogLanguageLink } from "@/components/blog/BlogLanguageLinks";

const MENU_PRODUCT_ORDER: Record<string, number> = { "hubai-x": 0, "masraf-x": 1, "sapai-x": 2, "crm-x": 3 };

/** langHref: dil degistiricinin hedefi disaridan verilebilir (404 sayfasi: diger dilin anasayfasi). */
export function HeaderMarkup({ locale, langHref }: { locale: Locale; langHref?: string }) {
  const pathname = usePathname();
  const content = locale === "en" ? en : tr;
  const ui = getUi(locale);
  const menuProducts = [...getProducts(locale)].sort(
    (a, b) => (MENU_PRODUCT_ORDER[a.slug] ?? 99) - (MENU_PRODUCT_ORDER[b.slug] ?? 99),
  );
  // Dilsiz yol: aktif menu ve dil degistirici bunun uzerinden calisir.
  const { path } = splitLocale(pathname);
  const href = (to: string) => localePath(locale, to);
  const otherLocale: Locale = locale === "en" ? "tr" : "en";
  const blogLanguageLink = useBlogLanguageLink(pathname, otherLocale);
  const switchHref = langHref ?? blogLanguageLink ?? localePath(otherLocale, path.startsWith("/blog/") ? "/blog" : path);
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
    <header ref={headerRef} className={themeClasses("Header_header__omCkM Header_header--theme-dark__ELG6D", theme)}><div className="Header_header__container__3CAEl"><div className="Header_header__static-container__i3bnO"><Link aria-label={`${brand.name} ${ui.homeAria}`} onClick={() => setOpenPath(null)} className="Logo_logo__Ov_7Y" href={href("/")}><BrandLogo className={themeClasses("Logo_logo--variant-dark__tSnF7 Logo_logo__logo__mSktt", theme)} /></Link><button ref={menuButtonRef} type="button" className={`${themeClasses("MenuButton_menu-button__yeeiB MenuButton_menu-button--variant-dark__Zj2ui", theme)}${isOpen ? " MenuButton_menu-button--open__P_dOs" : ""}`} aria-label={ui.menuToggle} aria-expanded={isOpen} aria-controls="theme-navigation" onClick={() => setOpenPath(isOpen ? null : pathname)}><span className="MenuButton_menu-button__line__pxoEp"></span><span className="MenuButton_menu-button__line__pxoEp"></span></button></div><div id="theme-navigation" className={`NavMenu_nav-menu__7FTtk${isOpen ? " NavMenu_nav-menu--open__GmntU" : ""}`} onClick={(event) => { if (event.target instanceof Element && event.target.closest("a")) { setOpenPath(null); setProductsOpen(false); } }}><nav aria-label={ui.mainNav} className="NavMenu_nav__zEkWZ"><Link className={themeClasses("NavLink_nav-link__i4vnc NavLink_nav-link--variant-default__JFDLS NavLink_nav-link--theme-dark__b93qe", theme)} href={href("/")} aria-current={path === "/" ? "page" : undefined}><span className="NavLink_nav-link__title-container__6oq4A"><span className={themeClasses("NavLink_nav-link__title-text__zzfMl NavLink_nav-link__title-text--theme-dark__Ne0bN", theme)}>{content.text_011}</span></span></Link><div className="ash-products-menu" ref={productsRef} data-open={productsOpen ? "true" : undefined}><button type="button" className={`${themeClasses("NavLink_nav-link__i4vnc NavLink_nav-link--variant-default__JFDLS NavLink_nav-link--theme-dark__b93qe", theme)} ash-products-menu__trigger`} aria-expanded={productsOpen} aria-controls="ash-products-panel" onClick={() => setProductsOpen((v) => !v)}><span className="NavLink_nav-link__title-container__6oq4A"><span className={themeClasses("NavLink_nav-link__title-text__zzfMl NavLink_nav-link__title-text--theme-dark__Ne0bN", theme)}>{content.text_001}</span></span><svg className="ash-products-menu__chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button><div id="ash-products-panel" className="ash-products-menu__panel" hidden={!productsOpen}><Link className="ash-products-menu__all" href={href("/products")}>{ui.allProducts}</Link>{menuProducts.map((product) => (<Link key={product.slug} className="ash-products-menu__item" href={href(`/products/${product.slug}`)} style={{ "--urun-renk": product.accent[0] } as CSSProperties}><span className="ash-products-menu__name"><ProductName name={product.name} /></span><span className="ash-products-menu__title">{product.title}</span></Link>))}</div></div><Link className={themeClasses("NavLink_nav-link__i4vnc NavLink_nav-link--variant-default__JFDLS NavLink_nav-link--theme-dark__b93qe", theme)} href={href("/why-ash")} aria-current={path === "/why-ash" ? "page" : undefined}><span className="NavLink_nav-link__title-container__6oq4A"><span className={themeClasses("NavLink_nav-link__title-text__zzfMl NavLink_nav-link__title-text--theme-dark__Ne0bN", theme)}>{content.text_006}</span></span></Link><Link className={themeClasses("NavLink_nav-link__i4vnc NavLink_nav-link--variant-default__JFDLS NavLink_nav-link--theme-dark__b93qe", theme)} href={href("/blog")} aria-current={path.startsWith("/blog") ? "page" : undefined}><span className="NavLink_nav-link__title-container__6oq4A"><span className={themeClasses("NavLink_nav-link__title-text__zzfMl NavLink_nav-link__title-text--theme-dark__Ne0bN", theme)}>{content.text_009}</span></span></Link><Link className={themeClasses("NavLink_nav-link__i4vnc NavLink_nav-link--variant-default__JFDLS NavLink_nav-link--theme-dark__b93qe", theme)} href={href("/contact")} aria-current={path === "/contact" ? "page" : undefined}><span className="NavLink_nav-link__title-container__6oq4A"><span className={themeClasses("NavLink_nav-link__title-text__zzfMl NavLink_nav-link__title-text--theme-dark__Ne0bN", theme)}>{content.text_010}</span></span></Link>{/* Telefon menusunde toplanti butonu; masaustunde header'in sag ucundaki kullanilir. */}<div className="ash-menu-meeting"><MeetingButton locale={locale} tone={theme === "dark" ? "light" : "dark"} /></div><Link className={`${themeClasses("NavLink_nav-link__i4vnc NavLink_nav-link--variant-default__JFDLS NavLink_nav-link--theme-dark__b93qe", theme)} ash-lang-switch ash-lang-switch--menu`} href={switchHref} hrefLang={otherLocale} lang={otherLocale} aria-label={ui.switchTo.label}><span className="NavLink_nav-link__title-container__6oq4A"><span className={themeClasses("NavLink_nav-link__title-text__zzfMl NavLink_nav-link__title-text--theme-dark__Ne0bN", theme)}>{ui.switchTo.short}</span></span></Link></nav></div>{/* Masaustunde sag uc: toplanti butonu ve en sagda dil secimi. Telefonda dil secimi menude. */}<div className="ash-header-actions"><MeetingButton locale={locale} tone={theme === "dark" ? "light" : "dark"} /><Link className={`${themeClasses("NavLink_nav-link__i4vnc NavLink_nav-link--variant-default__JFDLS NavLink_nav-link--theme-dark__b93qe", theme)} ash-lang-switch ash-lang-switch--bar`} href={switchHref} hrefLang={otherLocale} lang={otherLocale} aria-label={ui.switchTo.label}><span className="NavLink_nav-link__title-container__6oq4A"><span className={themeClasses("NavLink_nav-link__title-text__zzfMl NavLink_nav-link__title-text--theme-dark__Ne0bN", theme)}>{ui.switchTo.short}</span></span></Link></div></div></header>
  </>);
}
