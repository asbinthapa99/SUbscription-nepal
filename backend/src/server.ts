import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./db/prisma.js";

const PLACEHOLDER_SECRET = "replace-with-a-long-random-secret";
if (env.JWT_SECRET === PLACEHOLDER_SECRET || env.JWT_SECRET.startsWith("replace")) {
  console.error("FATAL: JWT_SECRET is still the placeholder value. Set a real secret before running in production.");
  if (env.NODE_ENV === "production") process.exit(1);
}

async function start() {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    console.error("FATAL: Cannot connect to database:", err);
    process.exit(1);
  }

  const server = app.listen(env.PORT, () => {
    console.log(`Backend API running on http://localhost:${env.PORT}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start();

