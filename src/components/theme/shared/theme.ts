export type PageTheme = "light" | "dark";

export function getPageTheme(pathname: string): PageTheme {
  // Tum sayfalar koyu header kullaniyor; yalnizca iletisim sayfasi acik kaliyor.
  return pathname === "/contact" ? "light" : "dark";
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
