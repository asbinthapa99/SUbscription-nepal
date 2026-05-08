import type { PlanType } from "@prisma/client";

export type PlanConfig = {
  id: PlanType;
  slug: string;
  name: string;
  description?: string;
  priceNpr: number;
  monthlyPrice: number;
  yearlyPrice: number;
  dailyPromptLimit: number;
  monthlyTokenLimit: number;
  allowedModels: string[];
  includedTools: string[];
  features: string[];
  badge?: string;
  cta: string;
  isPublic: boolean;
  isActive: boolean;
  sortOrder: number;
};

export const plans: Record<PlanType, PlanConfig> = {
  FREE: {
    id: "FREE",
    slug: "free",
    name: "Starter",
    description: "Try AI for free. No card, no commitment.",
    priceNpr: 0,
    monthlyPrice: 0,
    yearlyPrice: 0,
    dailyPromptLimit: 20,
    monthlyTokenLimit: 25_000,
    allowedModels: ["gpt-4.1-mini"],
    includedTools: ["Basic AI chat", "Prompt templates"],
    features: [
      "20 messages per day",
      "Basic AI chat access",
      "Prompt templates library",
      "Email support"
    ],
    cta: "Start for free",
    isPublic: true,
    isActive: true,
    sortOrder: 1
  },
  BASIC: {
    id: "BASIC",
    slug: "basic",
    name: "Basic",
    description: "Legacy starter paid plan.",
    priceNpr: 499,
    monthlyPrice: 499,
    yearlyPrice: 399,
    dailyPromptLimit: 50,
    monthlyTokenLimit: 250_000,
    allowedModels: ["gpt-4.1-mini"],
    includedTools: ["AI chat", "Basic prompts", "Usage dashboard"],
    features: ["50 messages per day", "Basic prompts", "Usage dashboard"],
    badge: "Legacy",
    cta: "Choose Basic",
    isPublic: false,
    isActive: true,
    sortOrder: 10
  },
  PRO: {
    id: "PRO",
    slug: "pro",
    name: "Pro",
    description: "GPT-4o and Claude access for students, freelancers, and developers.",
    priceNpr: 1499,
    monthlyPrice: 1499,
    yearlyPrice: 1199,
    dailyPromptLimit: 10_000,
    monthlyTokenLimit: 200_000,
    allowedModels: ["gpt-4.1-mini", "gpt-4.1", "gpt-4o"],
    includedTools: ["GPT-4o", "Claude", "Usage analytics", "API access"],
    features: [
      "Unlimited messages",
      "GPT-4o and Claude access",
      "API access with 200K tokens/month",
      "Usage analytics dashboard",
      "Priority support",
      "Nepali and English interface"
    ],
    badge: "Most popular",
    cta: "Get Pro",
    isPublic: true,
    isActive: true,
    sortOrder: 2
  },
  PREMIUM: {
    id: "PREMIUM",
    slug: "premium",
    name: "Premium",
    description: "Legacy premium individual plan.",
    priceNpr: 1999,
    monthlyPrice: 1999,
    yearlyPrice: 1599,
    dailyPromptLimit: 600,
    monthlyTokenLimit: 3_000_000,
    allowedModels: ["gpt-4.1-mini", "gpt-4.1", "gpt-4o"],
    includedTools: ["Advanced AI chat", "Premium models", "Service discounts", "Priority support"],
    features: ["Advanced AI chat", "Premium models", "Service discounts", "Priority support"],
    badge: "Legacy",
    cta: "Choose Premium",
    isPublic: false,
    isActive: true,
    sortOrder: 11
  },
  TEAM: {
    id: "TEAM",
    slug: "team",
    name: "Team",
    description: "Shared AI access for agencies and businesses.",
    priceNpr: 3999,
    monthlyPrice: 3999,
    yearlyPrice: 3199,
    dailyPromptLimit: 10_000,
    monthlyTokenLimit: 1_000_000,
    allowedModels: ["gpt-4.1-mini", "gpt-4.1", "gpt-4o"],
    includedTools: ["Everything in Pro", "5 seats", "Admin controls"],
    features: [
      "Everything in Pro",
      "5 team seats included",
      "1M tokens/month API access",
      "Admin panel and controls",
      "Custom usage limits per seat",
      "Dedicated support channel",
      "VAT invoice billing"
    ],
    cta: "Get Team",
    isPublic: true,
    isActive: true,
    sortOrder: 3
  },
  DEVELOPER: {
    id: "DEVELOPER",
    slug: "developer",
    name: "Developer API",
    description: "Server-side API access with NPR billing.",
    priceNpr: 2999,
    monthlyPrice: 2999,
    yearlyPrice: 2399,
    dailyPromptLimit: 1000,
    monthlyTokenLimit: 5_000_000,
    allowedModels: ["gpt-4.1-mini", "gpt-4.1", "gpt-4o"],
    includedTools: ["Developer API access", "Request logs", "API usage limits"],
    features: ["Developer API access", "Request logs", "API usage limits"],
    cta: "Contact sales",
    isPublic: false,
    isActive: true,
    sortOrder: 4
  },
  ENTERPRISE: {
    id: "ENTERPRISE",
    slug: "enterprise",
    name: "Enterprise",
    description: "Custom AI deployment and support.",
    priceNpr: 0,
    monthlyPrice: 0,
    yearlyPrice: 0,
    dailyPromptLimit: 10_000,
    monthlyTokenLimit: 50_000_000,
    allowedModels: ["gpt-4.1-mini", "gpt-4.1", "gpt-4o"],
    includedTools: ["Custom limits", "Managed onboarding", "Dedicated support"],
    features: ["Custom limits", "Managed onboarding", "Dedicated support"],
    cta: "Contact sales",
    isPublic: false,
    isActive: true,
    sortOrder: 5
  }
};
