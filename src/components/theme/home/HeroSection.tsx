/* Browser-extracted source design; editable copy/assets live beside this component. */
import tr from "./HeroSection.content.json";
import en from "./HeroSection.content.en.json";
import Link from "next/link";
import { localePath, type Locale } from "@/i18n/config";
import { ProductDemo } from "./ProductDemo";
import "./HeroSection.css";

export function HeroSection({ locale }: { locale: Locale }) {
  const content = locale === "en" ? en : tr;
  return (<>
    <section className="Hero_hero-container__y6xjY"><div className="Hero_hero__mpXIJ"><div className="Hero_content__Q0Yei"><h1 className="Text_text--display-s__xN_wr Text_text--weight-bold__jl20H Hero_content__title__xSQ97"><span className="ash-hero-title__lead">{content.text_001}</span>{" "}<span className="ash-grad-text">{content.text_001_accent}</span></h1><p className="Text_text--headline-m__C9G6u Text_text--weight-medium__uNX0v Hero_content__description__Cbxx5"><span className="">{content.text_002}</span></p><Link href={localePath(locale, "/products")} className="Button_button__30ukX Button_button--variant-colorful-dark__CCVPh Button_button--radius-large__M_ook"><div className="Button_button__children__eLy5L">{content.text_003}</div></Link></div><div className="Hero_background__ZMkDI"><div className="Hero_background__screenshot__0odgX"><ProductDemo locale={locale} /></div></div></div></section>
  </>);
}
