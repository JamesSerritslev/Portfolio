"use client";

import {
  prepareProjectToHomeNavigation,
  scheduleTransitionNavigation,
} from "@/lib/navigation-transition";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MOBILE_MAX_WIDTH_PX = 767;
const MIN_SWIPE_RIGHT_PX = 72;
const MAX_VERTICAL_DRIFT_PX = 64;

function isMobileViewport() {
  return window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH_PX}px)`).matches;
}

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      'input, textarea, button, select, a, label, [contenteditable="true"], .send-message-overlay',
    ),
  );
}

function isOverlayActive() {
  return Boolean(
    document.querySelector(
      ".send-message-overlay--shown, .send-message-overlay--thanks",
    ),
  );
}

/** Mobile: swipe right (finger moves right) to return home with page transition. */
export function useProjectInnerSwipeToHome() {
  const router = useRouter();

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let tracking = false;

    const goHome = () => {
      scheduleTransitionNavigation("/", prepareProjectToHomeNavigation, (target) => {
        router.push(target, { scroll: false });
      });
    };

    const onTouchStart = (event: TouchEvent) => {
      if (!isMobileViewport() || event.touches.length !== 1) return;
      if (isInteractiveTarget(event.target) || isOverlayActive()) return;

      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      tracking = true;
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (!tracking) return;
      tracking = false;

      if (!isMobileViewport() || isOverlayActive()) return;

      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      if (
        deltaX >= MIN_SWIPE_RIGHT_PX &&
        Math.abs(deltaY) <= MAX_VERTICAL_DRIFT_PX
      ) {
        goHome();
      }
    };

    const onTouchCancel = () => {
      tracking = false;
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("touchcancel", onTouchCancel, { passive: true });

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchcancel", onTouchCancel);
    };
  }, [router]);
}
