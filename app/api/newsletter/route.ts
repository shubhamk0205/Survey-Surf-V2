import type { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api/response";
import { prisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { newsletterSchema } from "@/lib/validations/newsletter";

/**
 * POST /api/newsletter
 * Idempotent subscription to the "field notes" list. Re-subscribing an
 * unsubscribed address reactivates it. Consumed by the footer form via
 * TanStack Query.
 */
export async function POST(request: NextRequest) {
  const limit = rateLimit(
    `newsletter:${clientIp(request.headers)}`,
    10,
    60_000,
  );
  if (!limit.ok) {
    return fail("Too many requests. Please try again shortly.", 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("Request body must be valid JSON.", 400);
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Validation failed.", 422, parsed.error.flatten().fieldErrors);
  }

  const { website, email } = parsed.data;
  if (website) {
    return ok({ subscribed: true }, 202);
  }

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: {
        email,
        source: request.headers.get("referer"),
      },
      update: {
        status: "SUBSCRIBED",
        unsubscribedAt: null,
      },
    });
    return ok({ subscribed: true }, 201);
  } catch (error) {
    console.error("[api/newsletter] failed:", error);
    return fail("Unable to subscribe right now.", 500);
  }
}
