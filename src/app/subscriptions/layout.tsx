import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscriptions Catalog | FlowAI Nepal",
  description: "Browse our full catalog of premium AI tools and entertainment subscriptions available in Nepal. Reliable access to the world's best tools.",
};

export default function SubscriptionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
