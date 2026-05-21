"use client";

import type { Project } from "@/data/projects";
import {
  prepareProjectToProjectNavigation,
  scheduleTransitionNavigation,
} from "@/lib/navigation-transition";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

const BOTTOM_THRESHOLD_PX = 64;
const WHEEL_THRESHOLD = 72;
const SWIPE_THRESHOLD_PX = 48;
const NAV_COOLDOWN_MS = 900;
const SMOOTH_SCROLL_MS = 520;

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function isNearPageBottom() {
  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight;
  return window.scrollY >= maxScroll - BOTTOM_THRESHOLD_PX;
}

function smoothScrollTo(targetY: number, duration = SMOOTH_SCROLL_MS): Promise<void> {
  return new Promise((resolve) => {
    const startY = window.scrollY;
    const distance = targetY - startY;

    if (Math.abs(distance) < 1) {
      resolve();
      return;
    }

    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, startY + distance * easeOutCubic(progress));

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(tick);
  });
}

interface ProjectScrollNavProps {
  currentSlug: string;
  nextProject: Project;
}

export function ProjectScrollNav({
  currentSlug,
  nextProject,
}: ProjectScrollNavProps) {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const navigatingRef = useRef(false);
  const wheelAccumulatorRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);

  const navigateToNext = useCallback(async () => {
    if (navigatingRef.current) return;
    navigatingRef.current = true;

    const href = `/projects/${nextProject.slug}`;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!reducedMotion) {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      await smoothScrollTo(maxScroll);
    }

    scheduleTransitionNavigation(href, prepareProjectToProjectNavigation, (target) => {
      router.push(target, { scroll: false });
    });

    window.setTimeout(() => {
      navigatingRef.current = false;
      wheelAccumulatorRef.current = 0;
    }, NAV_COOLDOWN_MS);
  }, [nextProject.slug, router]);

  const scrollToNextSection = useCallback(() => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    if (currentSlug === nextProject.slug) return;

    const onWheel = (event: WheelEvent) => {
      if (navigatingRef.current) {
        event.preventDefault();
        return;
      }

      if (!isNearPageBottom()) {
        wheelAccumulatorRef.current = 0;
        return;
      }

      if (event.deltaY <= 0) return;

      wheelAccumulatorRef.current += event.deltaY;
      if (wheelAccumulatorRef.current < WHEEL_THRESHOLD) return;

      event.preventDefault();
      void navigateToNext();
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (navigatingRef.current || touchStartYRef.current === null) return;
      if (!isNearPageBottom()) return;

      const endY = event.changedTouches[0]?.clientY;
      if (endY === undefined) return;

      const delta = touchStartYRef.current - endY;
      touchStartYRef.current = null;

      if (delta >= SWIPE_THRESHOLD_PX) {
        void navigateToNext();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [currentSlug, navigateToNext, nextProject.slug]);

  return (
    <section
      ref={sectionRef}
      aria-label={`Next project: ${nextProject.title}`}
      className="mt-16 border-t border-[#9F956C]/15 pt-12 sm:mt-20 sm:pt-16"
    >
      <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-[#9F956C]">
        Next Project
      </p>
      <button
        type="button"
        onClick={() => void navigateToNext()}
        className="group mt-6 w-full text-left"
      >
        <span className="font-serif text-2xl text-white transition-colors duration-300 group-hover:text-[#9F956C] sm:text-3xl">
          {nextProject.title}
        </span>
        <span className="mt-2 block font-sans text-sm text-[#888888] transition-colors duration-300 group-hover:text-white">
          Scroll down to continue
        </span>
      </button>
      <button
        type="button"
        onClick={scrollToNextSection}
        className="mt-8 inline-flex min-h-[44px] items-center font-sans text-xs uppercase tracking-[0.18em] text-[#9F956C] transition-colors hover:text-white"
        aria-label={`Jump to next project preview for ${nextProject.title}`}
      >
        Jump to next
      </button>
    </section>
  );
}
