import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { usageSummary } from "./usage.controller.js";

export const usageRoutes = Router();

usageRoutes.get("/summary", requireAuth, usageSummary);

