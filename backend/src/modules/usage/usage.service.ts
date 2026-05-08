import { startOfDay, startOfMonth } from "../../utils/date.js";
import { prisma } from "../../db/prisma.js";

export const getUsageSummary = async (userId: string) => {
  const now = new Date();
  const [today, month] = await Promise.all([
    prisma.usageLog.aggregate({
      where: {
        userId,
        createdAt: {
          gte: startOfDay(now)
        }
      },
      _sum: {
        requestCount: true,
        totalTokens: true
      }
    }),
    prisma.usageLog.aggregate({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth(now)
        }
      },
      _sum: {
        requestCount: true,
        totalTokens: true
      }
    })
  ]);

  return {
    promptsToday: today._sum.requestCount ?? 0,
    tokensToday: today._sum.totalTokens ?? 0,
    promptsThisMonth: month._sum.requestCount ?? 0,
    tokensThisMonth: month._sum.totalTokens ?? 0
  };
};

export const logUsage = async (input: {
  userId: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}) => {
  return prisma.usageLog.create({
    data: {
      userId: input.userId,
      model: input.model,
      promptTokens: input.promptTokens,
      completionTokens: input.completionTokens,
      totalTokens: input.totalTokens,
      requestCount: 1
    }
  });
};

