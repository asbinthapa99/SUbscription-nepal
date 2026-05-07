import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | FlowAI Nepal - Pay in NPR",
  description: "View pricing for ChatGPT Plus, Midjourney, Netflix, and other premium subscriptions in Nepal. Affordable rates, pay via eSewa or Khalti.",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
