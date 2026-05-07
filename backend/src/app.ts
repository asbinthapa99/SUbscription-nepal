import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { apiRateLimit } from "./middleware/rate-limit.middleware.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { planRoutes } from "./modules/plans/plans.routes.js";
import { serviceRoutes } from "./modules/services/services.routes.js";
import { subscriptionRoutes } from "./modules/subscriptions/subscription.routes.js";
import { usageRoutes } from "./modules/usage/usage.routes.js";
import { aiRoutes } from "./modules/ai/ai.routes.js";
import { paymentRoutes } from "./modules/payments/payment.routes.js";
import { adminRoutes } from "./modules/admin/admin.routes.js";
import { toolRoutes } from "./modules/tools/tools.routes.js";
import { serviceRequestRoutes } from "./modules/service-requests/service-request.routes.js";
import { productRoutes } from "./modules/products/products.routes.js";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(apiRateLimit);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/tools", toolRoutes);
app.use("/api/service-requests", serviceRequestRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/usage", usageRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);

app.use(errorMiddleware);
