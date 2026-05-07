import { Router } from "express";
import { listTools } from "./tools.controller.js";

export const toolRoutes = Router();

toolRoutes.get("/", listTools);
