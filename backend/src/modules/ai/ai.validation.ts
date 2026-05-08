import { z } from "zod";

export const chatSchema = z.object({
  prompt: z.string().trim().min(1).max(8000),
  model: z.string().trim().min(1).optional()
});

