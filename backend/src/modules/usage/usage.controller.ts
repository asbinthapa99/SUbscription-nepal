import { asyncHandler } from "../../utils/async-handler.js";
import { getPlanByType } from "../plans/plans.service.js";
import { getActiveSubscription } from "../subscriptions/subscription.service.js";
import { getUsageSummary } from "./usage.service.js";

export const usageSummary = asyncHandler(async (req, res) => {
  const [subscription, usage] = await Promise.all([
    getActiveSubscription(req.user!.id),
    getUsageSummary(req.user!.id)
  ]);

  const plan = subscription ? await getPlanByType(subscription.planType) : null;

  res.json({
    usage,
    limits: plan
      ? {
          dailyPromptLimit: plan.dailyPromptLimit,
          monthlyTokenLimit: plan.monthlyTokenLimit
        }
      : null
  });
});
