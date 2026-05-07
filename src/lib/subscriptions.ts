import type { LucideIcon } from "lucide-react";
import { Tv, MessageSquare, Music, PlayCircle, Sparkles, Globe, Zap, BookOpen } from "lucide-react";

export type SubscriptionCategory = "streaming" | "ai" | "music" | "productivity" | "education";

export type SubscriptionPlan = {
  id: string;
  slug: string;
  name: string;
  provider: string;
  description: string;
  category: SubscriptionCategory;
  icon: LucideIcon;
  accent: string;
  rgb: string;
  durations: {
    label: string;
    months: number;
    priceNpr: number;
    popular?: boolean;
  }[];
  features: string[];
  badge?: string;
  isFeatured: boolean;
};

export const subscriptionCatalog: SubscriptionPlan[] = [
  {
    id: "netflix",
    slug: "netflix",
    name: "Netflix",
    provider: "Netflix",
    description: "Stream movies, series, and documentaries. Standard or Premium screen sharing available.",
    category: "streaming",
    icon: Tv,
    accent: "#e50914",
    rgb: "229,9,20",
    durations: [
      { label: "1 Month", months: 1, priceNpr: 499 },
      { label: "3 Months", months: 3, priceNpr: 1299, popular: true },
      { label: "6 Months", months: 6, priceNpr: 2399 },
      { label: "1 Year", months: 12, priceNpr: 4499 },
    ],
    features: ["HD / 4K streaming", "Multiple screens", "Download offline", "All devices"],
    badge: "Best seller",
    isFeatured: true,
  },
  {
    id: "chatgpt-plus",
    slug: "chatgpt-plus",
    name: "ChatGPT Plus",
    provider: "OpenAI",
    description: "GPT-4o access, faster responses, image generation with DALL·E, and priority access.",
    category: "ai",
    icon: MessageSquare,
    accent: "#10a37f",
    rgb: "16,163,127",
    durations: [
      { label: "1 Month", months: 1, priceNpr: 1799 },
      { label: "3 Months", months: 3, priceNpr: 4999, popular: true },
      { label: "6 Months", months: 6, priceNpr: 9499 },
    ],
    features: ["GPT-4o access", "DALL·E image generation", "Advanced data analysis", "Priority speed"],
    badge: "Most popular",
    isFeatured: true,
  },
  {
    id: "claude-pro",
    slug: "claude-pro",
    name: "Claude Pro",
    provider: "Anthropic",
    description: "Claude 3.5 Sonnet & Opus access with 5x more usage than free plan.",
    category: "ai",
    icon: Zap,
    accent: "#d4733a",
    rgb: "212,115,58",
    durations: [
      { label: "1 Month", months: 1, priceNpr: 1799 },
      { label: "3 Months", months: 3, priceNpr: 4999, popular: true },
      { label: "6 Months", months: 6, priceNpr: 9499 },
    ],
    features: ["Claude 3.5 Sonnet", "Claude 3 Opus", "Priority bandwidth", "Projects & folders"],
    isFeatured: true,
  },
  {
    id: "spotify",
    slug: "spotify",
    name: "Spotify Premium",
    provider: "Spotify",
    description: "Ad-free music, offline listening, high-quality audio on all your devices.",
    category: "music",
    icon: Music,
    accent: "#1db954",
    rgb: "29,185,84",
    durations: [
      { label: "1 Month", months: 1, priceNpr: 299 },
      { label: "3 Months", months: 3, priceNpr: 799, popular: true },
      { label: "6 Months", months: 6, priceNpr: 1499 },
      { label: "1 Year", months: 12, priceNpr: 2799 },
    ],
    features: ["Ad-free music", "Offline downloads", "High quality audio", "All devices"],
    isFeatured: true,
  },
  {
    id: "youtube-premium",
    slug: "youtube-premium",
    name: "YouTube Premium",
    provider: "Google",
    description: "No ads on YouTube, background play, YouTube Music included.",
    category: "streaming",
    icon: PlayCircle,
    accent: "#ff0000",
    rgb: "255,0,0",
    durations: [
      { label: "1 Month", months: 1, priceNpr: 349 },
      { label: "3 Months", months: 3, priceNpr: 899, popular: true },
      { label: "1 Year", months: 12, priceNpr: 3299 },
    ],
    features: ["No ads", "Background play", "YouTube Music", "Offline downloads"],
    isFeatured: false,
  },
  {
    id: "canva-pro",
    slug: "canva-pro",
    name: "Canva Pro",
    provider: "Canva",
    description: "Professional design tools, premium templates, brand kit, and AI features.",
    category: "productivity",
    icon: Sparkles,
    accent: "#8b3dff",
    rgb: "139,61,255",
    durations: [
      { label: "1 Month", months: 1, priceNpr: 899 },
      { label: "3 Months", months: 3, priceNpr: 2399, popular: true },
      { label: "1 Year", months: 12, priceNpr: 7999 },
    ],
    features: ["Premium templates", "Brand kit", "Background remover", "AI design tools"],
    isFeatured: false,
  },
  {
    id: "nordvpn",
    slug: "nordvpn",
    name: "NordVPN",
    provider: "Nord Security",
    description: "Fast and secure VPN. Access blocked content and protect your privacy.",
    category: "productivity",
    icon: Globe,
    accent: "#4687ff",
    rgb: "70,135,255",
    durations: [
      { label: "1 Month", months: 1, priceNpr: 699 },
      { label: "3 Months", months: 3, priceNpr: 1799, popular: true },
      { label: "1 Year", months: 12, priceNpr: 5999 },
    ],
    features: ["6 devices", "No logs", "Malware protection", "Fast servers"],
    isFeatured: false,
  },
  {
    id: "duolingo-plus",
    slug: "duolingo-plus",
    name: "Duolingo Plus",
    provider: "Duolingo",
    description: "Learn languages without ads, with unlimited hearts and offline access.",
    category: "education",
    icon: BookOpen,
    accent: "#58cc02",
    rgb: "88,204,2",
    durations: [
      { label: "1 Month", months: 1, priceNpr: 249 },
      { label: "3 Months", months: 3, priceNpr: 649, popular: true },
      { label: "1 Year", months: 12, priceNpr: 2299 },
    ],
    features: ["No ads", "Unlimited hearts", "Offline lessons", "Progress tracking"],
    isFeatured: false,
  },
];

export const featuredSubscriptions = subscriptionCatalog.filter((s) => s.isFeatured);

export const categoryLabels: Record<SubscriptionCategory, string> = {
  streaming: "Streaming",
  ai: "AI Tools",
  music: "Music",
  productivity: "Productivity",
  education: "Education",
};
