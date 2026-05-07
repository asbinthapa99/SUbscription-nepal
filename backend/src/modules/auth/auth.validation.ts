import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8).max(100)
});

export const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1)
});

export const forgotSchema = z.object({
  email: z.string().trim().email().toLowerCase()
});

export const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(100)
});

