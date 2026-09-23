import { splitLocale } from "@/i18n/config";

export type PageTheme = "light" | "dark";

/**
 * Koyu header kullanacak sayfalar (dilden bagimsiz ic yol, orn. "/contact").
 * Su an bos: tum sayfalar acik header kullaniyor. Son koyu kalanlar yasal
 * metinler ve 404'tu; blog'un bant stilini paylasiyorlar ve bant acik griye
 * donunce koyu header'in altinda acik bir bant kaliyordu. Neden ASH ve
 * iletisim koyu hero ile aciliyor ama header'lari da bilerek acik.
 */
const DARK_HEADER_PATHS = new Set<string>();

export function getPageTheme(pathname: string): PageTheme {
  return DARK_HEADER_PATHS.has(splitLocale(pathname).path) ? "dark" : "light";
}

const lightClasses: Record<string, string> = {
  "Header_header--theme-dark__ELG6D": "Header_header--theme-light__HYowG",
  "Logo_logo--variant-dark__tSnF7": "Logo_logo--variant-light__woTHd",
  "MenuButton_menu-button--variant-dark__Zj2ui": "MenuButton_menu-button--variant-light__ET85x",
  "NavLink_nav-link--theme-dark__b93qe": "NavLink_nav-link--theme-light__4IIcA",
  "NavLink_nav-link__title-text--theme-dark__Ne0bN": "NavLink_nav-link__title-text--theme-light__xuTWC",
  "NavLink_nav-link__count--theme-dark__cwTac": "NavLink_nav-link__count--theme-light__1EAxH",
  "SocialLinks_link--dark__VcvJI": "SocialLinks_link--light__wdCsI",
};

/** Reuse the exact light variants from the captured source stylesheets. */
export function themeClasses(classes: string, theme: PageTheme): string {
  if (theme === "dark") return classes;
  return classes.split(" ").map((className) => lightClasses[className] ?? className).join(" ");
}
