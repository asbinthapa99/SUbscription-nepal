import { Router } from "express";
import { listPlans } from "./plans.controller.js";

export const planRoutes = Router();

planRoutes.get("/", listPlans);

