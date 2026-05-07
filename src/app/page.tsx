import { Metadata } from "next";
import { MarketingNavbar } from "@/components/layout/MarketingNavbar";

export const metadata: Metadata = {
  title: "FlowAI Nepal | Access Premium AI Tools in Nepal",
  description: "Nepal's #1 platform to access ChatGPT Plus, Midjourney, and Netflix. Pay via eSewa, Khalti, or IME Pay. Same-day delivery and genuine accounts.",
};

import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { FloatingChatbox } from "@/components/marketing/FloatingChatbox";
import { DashboardPreviewSection } from "@/components/sections/DashboardPreviewSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { ServicesPreviewSection } from "@/components/sections/ServicesPreviewSection";
import { TestimonialsTrustSection } from "@/components/sections/TestimonialsTrustSection";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { PoweredByStrip } from "@/components/sections/PoweredByStrip";
import { CTASection } from "@/components/sections/CTASection";

export default function HomePage() {
  return (
    <>
      <MarketingNavbar />
      <main className="pb-24 md:pb-0">
        <HeroSection />
        <TrustStrip />
        <PoweredByStrip />
        <FeaturesSection />
        <ServicesPreviewSection />
        <HowItWorksSection />
        <DashboardPreviewSection />
        <PricingSection />
        <TestimonialsTrustSection />
        <FAQSection />
        <CTASection />
      </main>
      <MarketingFooter />
      <FloatingChatbox />
    </>
  );
}
