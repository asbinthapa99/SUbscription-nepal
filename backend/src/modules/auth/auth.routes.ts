import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { authRateLimit } from "../../middleware/rate-limit.middleware.js";
import { login, me, register, forgotPassword, resetPassword, logout } from "./auth.controller.js";

export const authRoutes = Router();

authRoutes.post("/register", authRateLimit, register);
authRoutes.post("/login", authRateLimit, login);
authRoutes.get("/me", requireAuth, me);
authRoutes.post("/forgot", authRateLimit, forgotPassword);
authRoutes.post("/reset", authRateLimit, resetPassword);
authRoutes.post("/logout", logout);

