"use client";

import {
  applyEnterTransition,
  clearEnterTransitionClasses,
  clearExitTransitionClasses,
  clearNavScrollLock,
  readPendingTransition,
} from "@/lib/navigation-transition";
import {
  forceResetHomeDocument,
  resetMobileProjectPageScroll,
} from "@/lib/home-scroll-lock";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

const ENTER_DURATION_MS = 580;

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const enterTimeoutRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (enterTimeoutRef.current !== null) {
      window.clearTimeout(enterTimeoutRef.current);
      enterTimeoutRef.current = null;
    }

    clearExitTransitionClasses();

    const transition = readPendingTransition();

    if (pathname.startsWith("/projects/")) {
      resetMobileProjectPageScroll();
      if (transition === "home-to-project" || transition === "project-to-project") {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    }

    const shouldEnterProject =
      (transition === "home-to-project" || transition === "project-to-project") &&
      pathname.startsWith("/projects/");
    const shouldEnterHome =
      (transition === "project-to-home" || transition === "resume-to-home") &&
      pathname === "/";
    const isTransitioning = shouldEnterProject || shouldEnterHome;

    // Scrollable pages keep the native scrollbar — release any home exit lock.
    if (pathname !== "/") {
      clearNavScrollLock();
    }

    if (pathname === "/") {
      if (!isTransitioning) {
        forceResetHomeDocument();
        clearNavScrollLock();
      }
    } else if (!isTransitioning) {
      clearEnterTransitionClasses();
    }

    if (!isTransitioning) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      applyEnterTransition(transition);
      enterTimeoutRef.current = window.setTimeout(() => {
        clearEnterTransitionClasses();
        enterTimeoutRef.current = null;
      }, ENTER_DURATION_MS);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      if (enterTimeoutRef.current !== null) {
        window.clearTimeout(enterTimeoutRef.current);
        enterTimeoutRef.current = null;
      }
    };
  }, [pathname]);

  return children;
}
