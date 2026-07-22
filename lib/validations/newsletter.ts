import { z } from "zod";

/**
 * Newsletter ("field notes") subscription.
 * `website` is a honeypot and must stay empty.
 */
export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  // Honeypot — accepted by the schema, then dropped by the handler if filled.
  website: z.string().optional(),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
