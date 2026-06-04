"use client";

import { THANK_YOU_MESSAGE } from "@/lib/contact-thanks";
import { cn } from "@/lib/utils";

interface ThankYouMessageProps {
  onDismiss: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export function ThankYouMessage({ onDismiss, className }: ThankYouMessageProps) {
  return (
    <div className={cn("thank-you-message", className)}>
      <button
        type="button"
        className="thank-you-message__close"
        onClick={onDismiss}
        aria-label="Dismiss thank you message"
      >
        <span aria-hidden>×</span>
      </button>
      <p className="thank-you-message__sent font-sans text-sm font-semibold uppercase tracking-[0.28em] text-[#9F956C] sm:text-base">
        SENT
      </p>
      <p className="thank-you-message__body font-sans text-sm leading-relaxed text-white sm:text-base">
        {THANK_YOU_MESSAGE}
      </p>
    </div>
  );
}
