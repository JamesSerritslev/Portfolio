import { skipHomeEntranceAnimations } from "@/lib/page-reload";
import { useNavigationStore, type PageTransitionType } from "@/store/navigationStore";

const EXIT_HOME = "nav-exit-home";
const EXIT_PROJECT = "nav-exit-project";
const EXIT_RESUME = "nav-exit-resume";
const ENTER_HOME = "nav-enter-home";
const ENTER_PROJECT = "nav-enter-project";
const NAV_SCROLL_LOCK = "nav-scroll-lock";
const PENDING_TRANSITION_KEY = "portfolio-pending-transition";

/** Must match nav-exit-* animation duration in globals.css */
export const NAV_EXIT_MS = 380;

type NavScrollSnapshot = {
  htmlOverflow: string;
  bodyOverflow: string;
  bodyWidth: string;
  bodyMaxWidth: string;
};

let navScrollSnapshot: NavScrollSnapshot | null = null;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function setPendingTransition(type: PageTransitionType) {
  if (!type) return;
  useNavigationStore.getState().setPendingTransition(type);
  try {
    sessionStorage.setItem(PENDING_TRANSITION_KEY, type);
  } catch {
    // Storage unavailable — store-only is fine.
  }
}

export function clearExitTransitionClasses() {
  if (typeof document === "undefined") return;
  document.documentElement.classList.remove(EXIT_HOME, EXIT_PROJECT, EXIT_RESUME);
}

function lockNavScroll() {
  if (typeof document === "undefined") return;
  if (navScrollSnapshot) return;

  const html = document.documentElement;
  const body = document.body;
  const lockedWidth = body.getBoundingClientRect().width;

  navScrollSnapshot = {
    htmlOverflow: html.style.overflow,
    bodyOverflow: body.style.overflow,
    bodyWidth: body.style.width,
    bodyMaxWidth: body.style.maxWidth,
  };

  html.classList.add(NAV_SCROLL_LOCK);
  body.style.width = `${lockedWidth}px`;
  body.style.maxWidth = `${lockedWidth}px`;
  html.style.overflow = "hidden";
  body.style.overflow = "hidden";
}

export function clearNavScrollLock() {
  if (typeof document === "undefined") return;

  const html = document.documentElement;
  const body = document.body;
  html.classList.remove(NAV_SCROLL_LOCK);

  if (!navScrollSnapshot) {
    html.style.overflow = "";
    body.style.overflow = "";
    body.style.width = "";
    body.style.maxWidth = "";
    return;
  }

  const previous = navScrollSnapshot;
  navScrollSnapshot = null;

  html.style.overflow = previous.htmlOverflow;
  body.style.overflow = previous.bodyOverflow;
  body.style.width = previous.bodyWidth;
  body.style.maxWidth = previous.bodyMaxWidth;
}

export function clearEnterTransitionClasses() {
  if (typeof document === "undefined") return;
  document.documentElement.classList.remove(ENTER_HOME, ENTER_PROJECT);
  clearNavScrollLock();
}

/** Run exit animation, then navigate. Avoids onPointerDown + pointer-events breaking Link clicks. */
export function scheduleTransitionNavigation(
  href: string,
  prepare: () => void,
  navigate: (href: string) => void,
) {
  prepare();
  const delay = prefersReducedMotion() ? 0 : NAV_EXIT_MS;
  window.setTimeout(() => navigate(href), delay);
}

/** Home → project detail */
export function prepareHomeToProjectNavigation() {
  if (prefersReducedMotion()) return;
  setPendingTransition("home-to-project");
  lockNavScroll();
  document.documentElement.classList.add(EXIT_HOME);
}

/** Project detail → home */
export function prepareProjectToHomeNavigation() {
  skipHomeEntranceAnimations();
  if (prefersReducedMotion()) return;
  setPendingTransition("project-to-home");
  document.documentElement.classList.add(EXIT_PROJECT);
}

/** Project detail → next project detail */
export function prepareProjectToProjectNavigation() {
  if (prefersReducedMotion()) return;
  setPendingTransition("project-to-project");
  lockNavScroll();
  document.documentElement.classList.add(EXIT_PROJECT);
}

/** Resume → home (skips card arc, plays page transition) */
export function prepareResumeToHomeNavigation() {
  useNavigationStore.getState().setNavigatedFromResume(true);
  skipHomeEntranceAnimations();
  if (prefersReducedMotion()) return;
  setPendingTransition("resume-to-home");
  document.documentElement.classList.add(EXIT_RESUME);
}

export function applyEnterTransition(type: PageTransitionType) {
  const html = document.documentElement;
  clearExitTransitionClasses();

  if (type === "home-to-project" || type === "project-to-project") {
    html.classList.add(ENTER_PROJECT);
  } else if (type === "project-to-home" || type === "resume-to-home") {
    html.classList.add(ENTER_HOME);
  }
}

export function readPendingTransition(): PageTransitionType {
  const storeValue = useNavigationStore.getState().pendingTransition;
  useNavigationStore.getState().setPendingTransition(null);

  let storageValue: PageTransitionType = null;
  try {
    const stored = sessionStorage.getItem(PENDING_TRANSITION_KEY);
    if (
      stored === "home-to-project" ||
      stored === "project-to-home" ||
      stored === "project-to-project" ||
      stored === "resume-to-home"
    ) {
      storageValue = stored;
    }
    sessionStorage.removeItem(PENDING_TRANSITION_KEY);
  } catch {
    // Ignore storage errors.
  }

  return storeValue ?? storageValue ?? null;
}
