import type { Metadata } from "next";
import { HeroSection } from "@/components/theme/contact/HeroSection";
import { HashAnchorSection } from "@/components/theme/contact/HashAnchorSection";
import { ContactCardSection } from "@/components/theme/contact/ContactCardSection";
import { MapSection } from "@/components/theme/contact/MapSection";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Bir sürecin nerede tıkandığını konuşmak için bize yazın. ASH ile iletişim, ofis bilgisi ve mesaj formu.",
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return (<>
    <link rel="stylesheet" href="/theme/css/e78a177f763a2d41-fa7ea74400.css" precedence="page" />
    <main>
      <HeroSection />
      <HashAnchorSection />
      <ContactCardSection />
      <MapSection />
    </main>
  </>);
}
