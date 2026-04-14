import { Hero } from "@/components/sections/Hero";
import { PartnerMarquee } from "@/components/sections/PartnerMarquee";
import { StatBar } from "@/components/ui/StatBar";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { ProgrammeGrid } from "@/components/sections/ProgrammeGrid";
import { ResearchThemes } from "@/components/sections/ResearchThemes";
import { FeaturedQuote } from "@/components/sections/FeaturedQuote";
import { LatestNews } from "@/components/sections/LatestNews";
import { CTABand } from "@/components/sections/CTABand";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PartnerMarquee />
      <StatBar />
      <AboutTeaser />
      <ProgrammeGrid />
      <ResearchThemes />
      <FeaturedQuote />
      <LatestNews />
      <CTABand />
    </>
  );
}
