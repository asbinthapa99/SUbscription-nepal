import { Role } from "@prisma/client";
import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.js";
import { createPayment, verifyPayment } from "./payment.controller.js";

export const paymentRoutes = Router();

paymentRoutes.post("/initiate", requireAuth, createPayment);
paymentRoutes.post("/verify-manual", requireAuth, requireRole(Role.ADMIN), verifyPayment);

