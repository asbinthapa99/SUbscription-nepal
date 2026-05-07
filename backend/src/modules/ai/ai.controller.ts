import { asyncHandler } from "../../utils/async-handler.js";
import { createChatResponse } from "./ai.service.js";
import { chatSchema } from "./ai.validation.js";

export const chat = asyncHandler(async (req, res) => {
  const input = chatSchema.parse(req.body);
  const result = await createChatResponse({
    userId: req.user!.id,
    prompt: input.prompt,
    model: input.model
  });

  res.json(result);
});

