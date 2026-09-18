import type { Metadata } from "next";
import { HomeMotion } from "@/components/theme/home/HomeMotion";
import { HeroSection } from "@/components/theme/home/HeroSection";
import { WhatWeDoSection } from "@/components/theme/home/WhatWeDoSection";
import { InvestmentsSection } from "@/components/theme/home/InvestmentsSection";
import { HowWeWorkSection } from "@/components/theme/home/HowWeWorkSection";
import { LatestNewsSection } from "@/components/theme/home/LatestNewsSection";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Page() {
  return (<>
    <link rel="stylesheet" href="/theme/css/e603559e0d418cf3-9edf77a3bb.css" precedence="page" />
    <HomeMotion>
      <HeroSection />
      <WhatWeDoSection />
      <InvestmentsSection />
      <HowWeWorkSection />
      <LatestNewsSection />
    </HomeMotion>
  </>);
}
