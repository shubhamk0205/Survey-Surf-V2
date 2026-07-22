import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

import { authConfig } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

/**
 * Full Auth.js instance (Node runtime).
 *
 * Basic foundation only: a Prisma adapter with database-backed sessions and a
 * session callback that surfaces the user id and role for downstream
 * authorization. Add providers by setting the AUTH_* environment variables.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  ...authConfig,
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // `role` is added to the adapter user via the Prisma schema.
        session.user.role = (user as { role?: string }).role ?? "USER";
      }
      return session;
    },
  },
});
