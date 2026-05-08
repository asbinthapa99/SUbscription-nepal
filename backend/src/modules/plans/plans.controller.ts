import { asyncHandler } from "../../utils/async-handler.js";
import { listPublicPlans } from "./plans.service.js";

export const listPlans = asyncHandler(async (_req, res) => {
  const plans = await listPublicPlans();

  res.json({
    plans
  });
});
