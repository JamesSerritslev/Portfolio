"use client";

import { cn } from "@/lib/utils";

export type SendMessageButtonState = "idle" | "bubble" | "submitting";

export const BUBBLE_ANIMATION_MS = 400;

interface SendMessageButtonProps {
  state: SendMessageButtonState;
}

export function SendMessageButton({ state }: SendMessageButtonProps) {
  const isBusy = state === "bubble" || state === "submitting";

  return (
    <button
      type="submit"
      disabled={isBusy}
      className={cn(
        "bubble-btn",
        state === "bubble" && "bubble-btn--clicked",
        state === "submitting" && "bubble-btn--sending",
      )}
      aria-busy={state === "submitting"}
    >
      <span className="bubble-btn__label font-medium text-gold">Send message</span>
    </button>
  );
}
