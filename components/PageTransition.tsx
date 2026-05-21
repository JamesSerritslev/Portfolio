"use client";

import {
  applyEnterTransition,
  clearEnterTransitionClasses,
  clearExitTransitionClasses,
  clearNavScrollLock,
  readPendingTransition,
} from "@/lib/navigation-transition";
import { forceResetHomeDocument } from "@/lib/home-scroll-lock";
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

    const shouldEnterProject =
      transition === "home-to-project" && pathname.startsWith("/projects/");
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
