import type { DefaultSession } from "next-auth";

/**
 * Module augmentation: expose the user id and role on the session so
 * downstream code (authorization, server components) is strongly typed.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}
