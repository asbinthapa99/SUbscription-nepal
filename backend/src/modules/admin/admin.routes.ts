import { Role } from "@prisma/client";
import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.js";
import {
  adminSummary,
  listAdminContent,
  listAdminPayments,
  listAdminPlans,
  listAdminProducts,
  listAdminServices,
  listAdminSubscriptions,
  listAdminTools,
  listAdminUsage,
  listAdminUsers,
  updateAdminContent,
  upsertAdminPlan,
  upsertAdminProduct,
  upsertAdminService,
  upsertAdminTool,
  verifyAdminPayment,
} from "./admin.controller.js";

export const adminRoutes = Router();

adminRoutes.use(requireAuth, requireRole(Role.ADMIN));
adminRoutes.get("/summary", adminSummary);
adminRoutes.get("/users", listAdminUsers);
adminRoutes.get("/subscriptions", listAdminSubscriptions);
adminRoutes.get("/payments", listAdminPayments);
adminRoutes.get("/usage", listAdminUsage);
adminRoutes.get("/plans", listAdminPlans);
adminRoutes.put("/plans", upsertAdminPlan);
adminRoutes.get("/services", listAdminServices);
adminRoutes.put("/services", upsertAdminService);
adminRoutes.get("/tools", listAdminTools);
adminRoutes.put("/tools", upsertAdminTool);
adminRoutes.patch("/payments/:id/verify", verifyAdminPayment);
adminRoutes.get("/products", listAdminProducts);
adminRoutes.put("/products", upsertAdminProduct);
adminRoutes.get("/content", listAdminContent);
adminRoutes.patch("/content/:key", updateAdminContent);
