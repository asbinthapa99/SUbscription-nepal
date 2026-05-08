import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { prisma } from "../../db/prisma.js";

export const productRoutes = Router();

productRoutes.get(
  "/",
  asyncHandler(async (_req, res) => {
    const products = await prisma.subscriptionProduct.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    res.json({ products });
  })
);
