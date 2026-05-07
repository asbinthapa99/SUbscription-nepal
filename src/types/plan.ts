export type PlanType = "free" | "pro" | "team" | "enterprise";

export type BillingPeriod = "monthly" | "yearly";

export type PricingPlan = {
  id: PlanType;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  promptLimitDaily: number | null;
  tokenLimitMonthly: number | null;
  includedTools: string[];
  features: string[];
  badge?: string;
  featured: boolean;
  cta: string;
  href: string;
  isActive: boolean;
  isPublic: boolean;
};
