import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { aiRateLimit } from "../../middleware/rate-limit.middleware.js";
import { chat } from "./ai.controller.js";

export const aiRoutes = Router();

aiRoutes.post("/chat", requireAuth, aiRateLimit, chat);

