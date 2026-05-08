import { PlanType } from "@prisma/client";
import { z } from "zod";

export const upsertPlanSchema = z.object({
  planType: z.nativeEnum(PlanType),
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(500).optional(),
  priceNpr: z.number().int().min(0),
  dailyPromptLimit: z.number().int().min(1),
  monthlyTokenLimit: z.number().int().min(1),
  allowedModels: z.array(z.string().trim().min(1)).min(1),
  includedTools: z.array(z.string().trim().min(1)).default([]),
  badge: z.string().trim().max(40).optional(),
  isPublic: z.boolean().default(true),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0)
});

export const upsertServiceSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().min(10).max(800),
  category: z.string().trim().min(2).max(40),
  startingPriceNpr: z.number().int().min(0),
  includedTools: z.array(z.string().trim().min(1)).default([]),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0)
});

export const upsertToolSchema = z.object({
  key: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(800),
  category: z.string().trim().min(2).max(40),
  accent: z.string().trim().max(40).optional(),
  href: z.string().trim().max(300).optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0)
});
