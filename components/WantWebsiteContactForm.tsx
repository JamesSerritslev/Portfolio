"use client";

import { SendMessageActions } from "@/components/SendMessageActions";
import { BUBBLE_ANIMATION_MS } from "@/components/SendMessageButton";
import {
  BACKDROP_EXIT_MS,
  type SendMessageOverlayPhase,
} from "@/components/SendMessageOverlay";
import { contactFormSchema, type ContactFormValues } from "@/lib/contact-schema";
import { WANT_WEBSITE_PERFORMANCE_SECTION_ID } from "@/data/want-a-website";
import { delay } from "@/lib/delay";
import { cn } from "@/lib/utils";
import { useCallback, useRef, useState } from "react";

type FormState =
  | "idle"
  | "submitting"
  | "thanks"
  | "closing"
  | "error";

const LOADER_DISPLAY_MS = 4000;

/** Extra scroll past the performance heading on thank-you dismiss */
const DISMISS_SCROLL_OFFSET_PX = -30;

const inputClassName =
  "w-full rounded-xl border-2 border-[#9F956C]/25 bg-black px-4 py-3 font-sans text-sm text-white outline-none transition-colors placeholder:text-[#666666] focus:border-[#9F956C]";

function scrollToPerformanceOnDismiss() {
  const performanceSection = document.getElementById(
    WANT_WEBSITE_PERFORMANCE_SECTION_ID,
  );
  if (!performanceSection) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const top =
    performanceSection.getBoundingClientRect().top +
    window.scrollY +
    DISMISS_SCROLL_OFFSET_PX;
  window.scrollTo({
    top,
    behavior: reducedMotion ? "auto" : "smooth",
  });
}

export function WantWebsiteContactForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showButtonBubble, setShowButtonBubble] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const isClosingThanksRef = useRef(false);

  const isFormLocked =
    formState === "submitting" ||
    formState === "thanks" ||
    formState === "closing";

  const finishThanksOverlay = useCallback(async () => {
    if (isClosingThanksRef.current) return;
    isClosingThanksRef.current = true;

    setFormState("closing");
    formRef.current?.reset();
    scrollToPerformanceOnDismiss();

    await delay(BACKDROP_EXIT_MS);
    setFormState("idle");
    isClosingThanksRef.current = false;
  }, []);

  const handleDismissThanks = useCallback(() => {
    if (formState === "thanks") {
      void finishThanksOverlay();
    }
  }, [formState, finishThanksOverlay]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (formState !== "idle" && formState !== "error") return;

    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload: ContactFormValues = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    const parsed = contactFormSchema.safeParse(payload);
    if (!parsed.success) {
      setFormState("error");
      setErrorMessage(
        parsed.error.issues[0]?.message ?? "Please check your form and try again.",
      );
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    try {
      setFormState("submitting");
      const loaderStartedAt = Date.now();

      if (!reducedMotion) {
        setShowButtonBubble(true);
        await delay(BUBBLE_ANIMATION_MS);
        setShowButtonBubble(false);
      }

      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 30_000);

      let response: Response;
      try {
        response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
          signal: controller.signal,
        });
      } finally {
        window.clearTimeout(timeoutId);
      }

      let data: { error?: string } = {};
      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        data = (await response.json()) as { error?: string };
      }

      if (!response.ok) {
        setShowButtonBubble(false);
        setFormState("error");
        setErrorMessage(data.error ?? "Unable to send your message.");
        return;
      }

      const loaderElapsed = Date.now() - loaderStartedAt;
      if (loaderElapsed < LOADER_DISPLAY_MS) {
        await delay(LOADER_DISPLAY_MS - loaderElapsed);
      }

      setFormState("thanks");
    } catch (error) {
      setShowButtonBubble(false);
      setFormState("error");
      if (error instanceof DOMException && error.name === "AbortError") {
        setErrorMessage("Request timed out. Please try again.");
      } else {
        setErrorMessage("Unable to send your message. Please try again.");
      }
    }
  }

  const buttonState = showButtonBubble
    ? "bubble"
    : formState === "submitting" ||
        formState === "thanks" ||
        formState === "closing"
      ? "submitting"
      : "idle";

  const overlayPhase: SendMessageOverlayPhase =
    formState === "submitting"
      ? "loader"
      : formState === "thanks"
        ? "thanks"
        : formState === "closing"
          ? "exiting"
          : "closed";

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

      <form
          ref={formRef}
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
              disabled={isFormLocked}
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
              disabled={isFormLocked}
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
              disabled={isFormLocked}
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
              disabled={isFormLocked}
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
            <SendMessageActions
              state={buttonState}
              overlayPhase={overlayPhase}
              onDismissThanks={handleDismissThanks}
            />
          </div>
        </form>
    </section>
  );
}
