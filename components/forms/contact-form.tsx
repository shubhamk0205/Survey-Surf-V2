"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Slip } from "@/components/ui/button";
import { submitContact } from "@/lib/actions/contact";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import type { ActionState } from "@/types";

/**
 * "See your blind spot" enquiry form.
 * React Hook Form + Zod for instant client validation; submission goes to the
 * `submitContact` Server Action, which re-validates and persists.
 */
export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      competitor: "",
      message: "",
      website: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionState>({ status: "idle" });

  function onSubmit(data: ContactInput) {
    setResult({ status: "idle" });
    startTransition(async () => {
      const response = await submitContact(data);
      setResult(response);
      if (response.status === "success") reset();
    });
  }

  return (
    <form className="ss-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <p className="form-legend">
        <span className="req">*</span> Required
      </p>

      <div className="field">
        <label className="field-label" htmlFor="contact-name">
          Your name<span className="req">*</span>
        </label>
        <input
          id="contact-name"
          className="field-input"
          type="text"
          autoComplete="name"
          aria-required="true"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          {...register("name")}
        />
        {errors.name ? (
          <span id="contact-name-error" className="field-error" role="alert">
            {errors.name.message}
          </span>
        ) : null}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="contact-email">
          Work email<span className="req">*</span>
        </label>
        <input
          id="contact-email"
          className="field-input"
          type="email"
          autoComplete="email"
          aria-required="true"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          {...register("email")}
        />
        {errors.email ? (
          <span id="contact-email-error" className="field-error" role="alert">
            {errors.email.message}
          </span>
        ) : null}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="contact-company">
          Who you are <span className="app">— your company</span>
        </label>
        <input
          id="contact-company"
          className="field-input"
          type="text"
          autoComplete="organization"
          aria-invalid={Boolean(errors.company)}
          aria-describedby={
            errors.company ? "contact-company-error" : undefined
          }
          {...register("company")}
        />
        {errors.company ? (
          <span id="contact-company-error" className="field-error" role="alert">
            {errors.company.message}
          </span>
        ) : null}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="contact-competitor">
          Who you’re up against <span className="app">— a rival or two</span>
        </label>
        <input
          id="contact-competitor"
          className="field-input"
          type="text"
          aria-invalid={Boolean(errors.competitor)}
          aria-describedby={
            errors.competitor ? "contact-competitor-error" : undefined
          }
          {...register("competitor")}
        />
        {errors.competitor ? (
          <span
            id="contact-competitor-error"
            className="field-error"
            role="alert"
          >
            {errors.competitor.message}
          </span>
        ) : null}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="contact-message">
          What you want to find out<span className="req">*</span>
        </label>
        <textarea
          id="contact-message"
          className="field-textarea"
          rows={4}
          aria-required="true"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message ? "contact-message-error" : undefined
          }
          {...register("message")}
        />
        {errors.message ? (
          <span id="contact-message-error" className="field-error" role="alert">
            {errors.message.message}
          </span>
        ) : null}
      </div>

      {/* honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hp-field"
        {...register("website")}
      />

      <div className="form-foot">
        <Slip type="submit" disabled={isPending}>
          {isPending ? "Sending…" : "See your blind spot  →"}
        </Slip>
        {result.status !== "idle" ? (
          <p
            className="form-status"
            data-state={result.status}
            role="status"
            aria-live="polite"
          >
            {result.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
