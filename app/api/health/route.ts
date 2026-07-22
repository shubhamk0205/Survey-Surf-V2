import { fail, ok } from "@/lib/api/response";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/health
 * Liveness + database connectivity probe for uptime checks and deploys.
 */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return ok({ status: "healthy", database: "connected" });
  } catch (error) {
    console.error("[api/health] database check failed:", error);
    return fail("Database unavailable.", 503);
  }
}
