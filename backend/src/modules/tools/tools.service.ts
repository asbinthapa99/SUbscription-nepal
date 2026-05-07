import { aiTools } from "../../config/tools.js";
import { prisma } from "../../db/prisma.js";

export const listPublicTools = async () => {
  const dbTools = await prisma.aiTool
    .findMany({
      where: {
        isActive: true
      },
      orderBy: {
        sortOrder: "asc"
      }
    })
    .catch(() => []);

  if (dbTools.length > 0) {
    return dbTools;
  }

  return aiTools.filter((tool) => tool.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
};
