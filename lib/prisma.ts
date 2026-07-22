import { PrismaClient } from "@prisma/client";

import { env } from "@/lib/env";

/**
 * A single PrismaClient instance, reused across hot reloads in development
 * to avoid exhausting database connections. In production a fresh client
 * is created per serverless instance.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
