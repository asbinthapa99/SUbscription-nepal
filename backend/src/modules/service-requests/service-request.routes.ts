import { Role } from "@prisma/client";
import { Router } from "express";
import { requireAuth, requireOptionalAuth, requireRole } from "../../middleware/auth.middleware.js";
import {
  listAdminServiceRequests,
  submitServiceRequest,
  updateAdminServiceRequestStatus
} from "./service-request.controller.js";

export const serviceRequestRoutes = Router();

serviceRequestRoutes.post("/", requireOptionalAuth, submitServiceRequest);
serviceRequestRoutes.get("/admin", requireAuth, requireRole(Role.ADMIN), listAdminServiceRequests);
serviceRequestRoutes.patch(
  "/admin/:id/status",
  requireAuth,
  requireRole(Role.ADMIN),
  updateAdminServiceRequestStatus
);
