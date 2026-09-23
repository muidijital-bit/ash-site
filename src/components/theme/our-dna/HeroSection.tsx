"use client";
/* Browser-extracted source design; editable copy/assets live beside this component. */
import tr from "./HeroSection.content.json";
import en from "./HeroSection.content.en.json";
import type { Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import assets from "./HeroSection.assets.json";
import "./HeroSection.css";

export function HeroSection({ locale }: { locale: Locale }) {
  const content = locale === "en" ? en : tr;
  return (<>
    <section className="Hero_hero__L_cFC"><div className="Hero_image__FlQan"><span className="capture-12488365a9"><img alt="" sizes="100vw" src={assets.image_001} decoding="async" className="Hero_image__image__vF8WZ capture-0e45414099" /></span></div><div className="Hero_content__IPm45"><h1 className="Text_text--display-m__q0ZjI Text_text--weight-bold__jl20H Hero_content__title__MZlmX"><span className="">{content.text_001}</span></h1><p className="ash-dna-lead">{content.text_002}</p><button onClick={() => document.querySelector(".OurMission_our-mission__RUrGu")?.scrollIntoView({behavior: "smooth"})} aria-label={getUi(locale).why.toMission} className="ScrollHandle_scroll-handle____eVi Hero_scroll-handle__0YYFk"><div className="ScrollHandle_scroll-handle__circle__jOGI0"><svg fill="none" viewBox="0 0 12 8" xmlns="http://www.w3.org/2000/svg" className="ScrollHandle_scroll-handle__arrow__fOugl"><path d="m11 1.95-4.949 4.88-4.95-4.88" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg></div></button></div></section>
  </>);
}
