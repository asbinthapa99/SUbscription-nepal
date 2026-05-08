import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { getBillingOverview, getCurrentSubscription } from "./subscription.controller.js";

export const subscriptionRoutes = Router();

subscriptionRoutes.get("/current", requireAuth, getCurrentSubscription);
subscriptionRoutes.get("/billing", requireAuth, getBillingOverview);

