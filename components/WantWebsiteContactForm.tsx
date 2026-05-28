"use client";

import type { ContactFormValues } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";
import { useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

const inputClassName =
  "w-full rounded-xl border-2 border-[#9F956C]/25 bg-black px-4 py-3 font-sans text-sm text-white outline-none transition-colors placeholder:text-[#666666] focus:border-[#9F956C]";

export function WantWebsiteContactForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState("submitting");
    setErrorMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload: ContactFormValues = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setFormState("error");
        setErrorMessage(data.error ?? "Unable to send your message.");
        return;
      }

      setFormState("success");
      form.reset();
    } catch {
      setFormState("error");
      setErrorMessage("Unable to send your message. Please try again.");
    }
  }

  return (
    <section className="mt-12 sm:mt-16">
      <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-[#9F956C]">
        Get in touch
      </p>
      <h2 className="mt-3 font-serif text-2xl text-white sm:text-3xl">
        Tell me about your project
      </h2>
      <p className="mt-4 max-w-2xl font-sans text-sm leading-relaxed text-[#888888] sm:text-base">
        Share a few details and I will follow up to discuss scope, timeline, and
        next steps.
      </p>

      {formState === "success" ? (
        <div
          className="mt-8 rounded-2xl border-2 border-[#9F956C]/40 bg-black px-5 py-4 font-sans text-sm leading-relaxed text-white sm:px-6 sm:py-5 sm:text-base"
          role="status"
        >
          Thank you. Your message has been sent. I will be in touch soon.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-8 grid gap-5 sm:grid-cols-2"
          noValidate
        >
          <label className="block sm:col-span-1">
            <span className="mb-2 block font-sans text-xs uppercase tracking-[0.16em] text-[#9F956C]">
              Name
            </span>
            <input
              type="text"
              name="name"
              required
              autoComplete="name"
              className={inputClassName}
              disabled={formState === "submitting"}
            />
          </label>

          <label className="block sm:col-span-1">
            <span className="mb-2 block font-sans text-xs uppercase tracking-[0.16em] text-[#9F956C]">
              Phone
            </span>
            <input
              type="tel"
              name="phone"
              required
              autoComplete="tel"
              className={inputClassName}
              disabled={formState === "submitting"}
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-2 block font-sans text-xs uppercase tracking-[0.16em] text-[#9F956C]">
              Email
            </span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className={inputClassName}
              disabled={formState === "submitting"}
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-2 block font-sans text-xs uppercase tracking-[0.16em] text-[#9F956C]">
              Message
            </span>
            <textarea
              name="message"
              required
              rows={6}
              className={cn(inputClassName, "resize-y")}
              disabled={formState === "submitting"}
            />
          </label>

          {errorMessage ? (
            <p
              className="sm:col-span-2 font-sans text-sm text-red-400"
              role="alert"
            >
              {errorMessage}
            </p>
          ) : null}

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={formState === "submitting"}
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg border-2 border-[#9F956C]/40 px-6 py-3 font-sans text-sm font-medium text-[#9F956C] transition-colors hover:border-[#9F956C] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {formState === "submitting" ? "Sending..." : "Send message"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
