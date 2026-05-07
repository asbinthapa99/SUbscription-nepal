import { z } from "zod";

export const createServiceRequestSchema = z.object({
  serviceSlug: z
    .string()
    .trim()
    .min(2)
    .max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().toLowerCase(),
  phone: z.string().trim().min(7).max(30).optional(),
  message: z.string().trim().min(10).max(1500),
  budgetNpr: z.number().int().min(0).max(10_000_000).optional()
});

export const updateServiceRequestStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "IN_PROGRESS", "WON", "LOST", "CLOSED"])
});
