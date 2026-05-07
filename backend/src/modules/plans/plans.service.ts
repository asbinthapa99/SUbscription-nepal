import type { PlanType } from "@prisma/client";
import { plans, type PlanConfig } from "../../config/plans.js";
import { prisma } from "../../db/prisma.js";

const toPlanConfig = (plan: {
  planType: PlanType;
  name: string;
  description: string | null;
  priceNpr: number;
  dailyPromptLimit: number;
  monthlyTokenLimit: number;
  allowedModels: unknown;
  includedTools: unknown;
  badge: string | null;
  isPublic: boolean;
  isActive: boolean;
  sortOrder: number;
}): PlanConfig => ({
  id: plan.planType,
  slug: plan.planType.toLowerCase(),
  name: plan.name,
  description: plan.description ?? undefined,
  priceNpr: plan.priceNpr,
  monthlyPrice: plan.priceNpr,
  yearlyPrice: Math.round(plan.priceNpr * 0.8),
  dailyPromptLimit: plan.dailyPromptLimit,
  monthlyTokenLimit: plan.monthlyTokenLimit,
  allowedModels: Array.isArray(plan.allowedModels) ? plan.allowedModels.map(String) : [],
  includedTools: Array.isArray(plan.includedTools) ? plan.includedTools.map(String) : [],
  features: Array.isArray(plan.includedTools) ? plan.includedTools.map(String) : [],
  badge: plan.badge ?? undefined,
  cta: plan.planType === "FREE" ? "Start for free" : `Get ${plan.name}`,
  isPublic: plan.isPublic,
  isActive: plan.isActive,
  sortOrder: plan.sortOrder
});

export const listPublicPlans = async () => {
  const dbPlans = await prisma.plan
    .findMany({
      where: {
        isPublic: true,
        isActive: true
      },
      orderBy: {
        sortOrder: "asc"
      }
    })
    .catch(() => []);

  if (dbPlans.length > 0) {
    return dbPlans.map(toPlanConfig);
  }

  return Object.values(plans)
    .filter((plan) => plan.isPublic && plan.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);
};

export const getPlanByType = async (planType: PlanType) => {
  const dbPlan = await prisma.plan
    .findUnique({
      where: { planType }
    })
    .catch(() => null);

  if (dbPlan?.isActive) {
    return toPlanConfig(dbPlan);
  }

  return plans[planType];
};
