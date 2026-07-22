import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

import { env } from "@/lib/env";

/**
 * Edge-safe Auth.js configuration.
 *
 * This half of the config contains no database/adapter references, so it can
 * be imported by middleware running on the Edge runtime. The full config
 * (adapter + Node-only bits) lives in `lib/auth.ts`.
 *
 * A provider is only registered when its credentials are present, so the app
 * boots cleanly in local dev without any OAuth setup.
 */
const providers: NextAuthConfig["providers"] =
  env.AUTH_GITHUB_ID && env.AUTH_GITHUB_SECRET
    ? [
        GitHub({
          clientId: env.AUTH_GITHUB_ID,
          clientSecret: env.AUTH_GITHUB_SECRET,
        }),
      ]
    : [];

export const authConfig = {
  providers,
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;
