import type { Metadata } from "next";
import { HeroSection } from "@/components/theme/our-dna/HeroSection";
import { OurMissionSection } from "@/components/theme/our-dna/OurMissionSection";
import { ValuesSection } from "@/components/theme/our-dna/ValuesSection";
import { ProcessSection } from "@/components/theme/our-dna/ProcessSection";

export const metadata: Metadata = {
  title: "Neden ASH",
  description:
    "Mevcut sisteminizi okuyarak başlayan, pilotta kalmayan ve devredilebilir iş bırakan bir çalışma biçimi. ASH'in altı değeri ve keşiften canlı sonrasına beş adımı.",
  alternates: { canonical: "/our-dna" },
};

export default function Page() {
  return (<>
    <link rel="stylesheet" href="/theme/css/aa8a819d9c67563a-0133a7d1e7.css" precedence="page" />
    <main>
      <HeroSection />
      <OurMissionSection />
      <ValuesSection />
      <ProcessSection />
    </main>
  </>);
}
