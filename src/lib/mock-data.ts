import { pricingPlans } from "@/lib/plans";
import { aiServices } from "@/lib/services";

export const mockData = {
  pricingPlans,
  aiServices,
  currentUser: {
    id: "user_001",
    name: "Demo User",
    email: "demo@flowainepal.com",
  },
  subscription: {
    id: "sub_001",
    userId: "user_001",
    plan: "pro",
    status: "active",
    expiresAt: "2026-12-31",
  },
  usageSummary: {
    promptsToday: 42,
    promptLimitToday: null,
    tokensThisMonth: 18450,
    tokenLimitThisMonth: 100000,
  },
};
