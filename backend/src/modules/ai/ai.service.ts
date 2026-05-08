import OpenAI from "openai";
import { env } from "../../config/env.js";
import { ApiError } from "../../utils/api-error.js";
import { getUsageSummary, logUsage } from "../usage/usage.service.js";
import { requireActiveSubscription } from "../subscriptions/subscription.service.js";
import { getPlanByType } from "../plans/plans.service.js";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY || "missing-key"
});

const estimateTokens = (text: string) => Math.ceil(text.length / 4);

export const createChatResponse = async (input: {
  userId: string;
  prompt: string;
  model?: string;
}) => {
  const subscription = await requireActiveSubscription(input.userId);
  const plan = await getPlanByType(subscription.planType);
  const model = input.model ?? plan.allowedModels[0] ?? env.OPENAI_DEFAULT_MODEL;

  if (!plan.allowedModels.includes(model)) {
    throw new ApiError(403, "Selected model is not available on your plan");
  }

  const usage = await getUsageSummary(input.userId);

  if (usage.promptsToday >= plan.dailyPromptLimit) {
    throw new ApiError(429, "Daily prompt limit reached");
  }

  if (usage.tokensThisMonth >= plan.monthlyTokenLimit) {
    throw new ApiError(429, "Monthly token limit reached");
  }

  if (env.AI_MOCK_ENABLED || !env.OPENAI_API_KEY) {
    const text = `Mock AI response for: ${input.prompt}`;
    const promptTokens = estimateTokens(input.prompt);
    const completionTokens = estimateTokens(text);

    await logUsage({
      userId: input.userId,
      model,
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens
    });

    return {
      response: text,
      model,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens
      }
    };
  }

  const response = (await openai.responses.create({
    model,
    instructions:
      "You are a helpful AI assistant for FlowAI Nepal users. Be clear, useful, and safe.",
    input: input.prompt,
    max_output_tokens: 1000
  })) as any;

  const text = response.output_text ?? "";
  const promptTokens = response.usage?.input_tokens ?? estimateTokens(input.prompt);
  const completionTokens = response.usage?.output_tokens ?? estimateTokens(text);
  const totalTokens = response.usage?.total_tokens ?? promptTokens + completionTokens;

  await logUsage({
    userId: input.userId,
    model,
    promptTokens,
    completionTokens,
    totalTokens
  });

  return {
    response: text,
    model,
    usage: {
      promptTokens,
      completionTokens,
      totalTokens
    }
  };
};
