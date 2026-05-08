import { Router } from "express";
import { listServices } from "./services.controller.js";

export const serviceRoutes = Router();

serviceRoutes.get("/", listServices);
