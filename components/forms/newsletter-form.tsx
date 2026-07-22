"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { Slip } from "@/components/ui/button";
import {
  newsletterSchema,
  type NewsletterInput,
} from "@/lib/validations/newsletter";

async function subscribe(input: NewsletterInput): Promise<void> {
  const response = await fetch("/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const payload = (await response.json()) as { ok: boolean; error?: string };
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error ?? "Subscription failed. Please try again.");
  }
}

/**
 * "Field notes" subscription slip in the imprint. Demonstrates the TanStack
 * Query mutation flow against POST /api/newsletter, with client-side Zod
 * validation for instant feedback. The honeypot is read from the form and
 * transmitted so the server-side trap can fire.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);
  const mutation = useMutation({ mutationFn: subscribe });

  function submitForm(form: HTMLFormElement) {
    setClientError(null);
    const website = new FormData(form).get("website")?.toString() ?? "";
    const parsed = newsletterSchema.safeParse({ email, website });
    if (!parsed.success) {
      setClientError(
        parsed.error.issues[0]?.message ?? "Enter a valid email address.",
      );
      return;
    }
    mutation.mutate(parsed.data);
  }

  const state: "idle" | "error" | "success" = mutation.isSuccess
    ? "success"
    : clientError || mutation.isError
      ? "error"
      : "idle";

  const note =
    state === "success"
      ? "Subscribed — field notes will find you."
      : (clientError ?? (mutation.error as Error | null)?.message ?? null);

  return (
    <form
      className="news-slip"
      onSubmit={(event) => {
        event.preventDefault();
        submitForm(event.currentTarget);
      }}
      noValidate
      aria-label="Subscribe to field notes"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        name="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Subscribe to the field notes — your email"
        autoComplete="email"
        aria-invalid={state === "error"}
        aria-describedby={state === "error" ? "newsletter-note" : undefined}
      />
      {/* honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hp-field"
      />
      <Slip type="submit" size="small" disabled={mutation.isPending}>
        {mutation.isPending ? "Subscribing…" : "Subscribe"}
      </Slip>
      {note ? (
        <p
          id="newsletter-note"
          className="news-slip-note"
          data-state={state === "error" ? "error" : undefined}
          role={state === "error" ? "alert" : "status"}
        >
          {note}
        </p>
      ) : null}
    </form>
  );
}
