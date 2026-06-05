"use client";

import { SendMessageLoader } from "@/components/SendMessageLoader";
import { ThankYouMessage } from "@/components/ThankYouMessage";
import { cn } from "@/lib/utils";
import { THANK_YOU_MESSAGE } from "@/lib/contact-thanks";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export const LOADER_FADE_MS = 450;
export const BACKDROP_EXIT_MS = 900;

export type SendMessageOverlayPhase = "closed" | "loader" | "thanks" | "exiting";

interface SendMessageOverlayProps {
  phase: SendMessageOverlayPhase;
  onDismissThanks?: () => void;
}

export function SendMessageOverlay({
  phase,
  onDismissThanks,
}: SendMessageOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [render, setRender] = useState(false);
  const [entered, setEntered] = useState(false);

  const isActive = phase !== "closed";
  const isShown = phase === "loader" || phase === "thanks" || phase === "exiting";
  const canDismissThanks = phase === "thanks";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (isActive) {
      setRender(true);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setEntered(true));
      });
      return () => cancelAnimationFrame(frame);
    }

    setEntered(false);
    const timeout = window.setTimeout(() => setRender(false), 100);
    return () => window.clearTimeout(timeout);
  }, [isActive, mounted]);

  useEffect(() => {
    if (!render) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [render]);

  if (!mounted || !render) return null;

  return createPortal(
    <div
      className={cn(
        "send-message-overlay",
        entered && isShown && "send-message-overlay--shown",
        phase === "thanks" && "send-message-overlay--thanks",
        phase === "exiting" && "send-message-overlay--exiting",
      )}
      onClick={canDismissThanks ? () => onDismissThanks?.() : undefined}
      role="status"
      aria-live="polite"
      aria-label={
        phase === "thanks" || phase === "exiting"
          ? `SENT. ${THANK_YOU_MESSAGE}`
          : "Sending your message"
      }
      aria-busy={phase === "loader"}
    >
      <button
        type="button"
        className="send-message-overlay__backdrop"
        aria-hidden
        tabIndex={-1}
      />
      <div className="send-message-overlay__content">
        {phase === "loader" ? (
          <div className="send-message-overlay__loader-panel">
            <SendMessageLoader size="overlay" />
            <p className="send-message-overlay__label font-sans text-sm font-medium uppercase tracking-[0.2em]">
              Sending
              <span className="send-message-overlay__dots" aria-hidden>
                <span />
                <span />
                <span />
              </span>
            </p>
          </div>
        ) : null}
        {phase === "thanks" || phase === "exiting" ? (
          <ThankYouMessage
            className="send-message-overlay__thanks"
            onDismiss={(event) => {
              event.stopPropagation();
              onDismissThanks?.();
            }}
          />
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
