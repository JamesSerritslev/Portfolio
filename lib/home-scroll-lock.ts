const OVERLAY_ID = "home-nav-overlay";
const DESKTOP_QUERY = "(min-width: 768px)";

type ScrollLockSnapshot = {
  htmlOverflow: string;
  htmlHeight: string;
  htmlMaxHeight: string;
  bodyOverflow: string;
  bodyPosition: string;
  bodyTop: string;
  bodyWidth: string;
  bodyLeft: string;
  bodyRight: string;
  bodyMinHeight: string;
};

let scrollLockCount = 0;
let scrollLockSnapshot: ScrollLockSnapshot | null = null;
let homeScrollUnlock: (() => void) | null = null;

function isDesktopViewport() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

function applyScrollLock(fixedTop: string) {
  const html = document.documentElement;
  const body = document.body;

  scrollLockSnapshot = {
    htmlOverflow: html.style.overflow,
    htmlHeight: html.style.height,
    htmlMaxHeight: html.style.maxHeight,
    bodyOverflow: body.style.overflow,
    bodyPosition: body.style.position,
    bodyTop: body.style.top,
    bodyWidth: body.style.width,
    bodyLeft: body.style.left,
    bodyRight: body.style.right,
    bodyMinHeight: body.style.minHeight,
  };

  html.classList.add("home-arc-lock");
  html.style.overflow = "hidden";
  html.style.height = "100dvh";
  html.style.maxHeight = "100dvh";

  body.style.position = "fixed";
  body.style.top = fixedTop;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
  body.style.minHeight = "0";
  body.style.overflow = "hidden";
}

function removeScrollLock() {
  if (!scrollLockSnapshot) return;

  const html = document.documentElement;
  const body = document.body;
  const previous = scrollLockSnapshot;
  scrollLockSnapshot = null;

  html.classList.remove("home-arc-lock");
  html.style.overflow = previous.htmlOverflow;
  html.style.height = previous.htmlHeight;
  html.style.maxHeight = previous.htmlMaxHeight;

  body.style.position = previous.bodyPosition;
  body.style.top = previous.bodyTop;
  body.style.left = previous.bodyLeft;
  body.style.right = previous.bodyRight;
  body.style.width = previous.bodyWidth;
  body.style.minHeight = previous.bodyMinHeight;
  body.style.overflow = previous.bodyOverflow;

  hideHomeTransitionOverlay();
  window.scrollTo(0, 0);
}

function acquireScrollLock(fixedTop: string): () => void {
  scrollLockCount += 1;
  if (scrollLockCount === 1) {
    applyScrollLock(fixedTop);
  }

  let released = false;
  return () => {
    if (released) return;
    released = true;
    scrollLockCount = Math.max(0, scrollLockCount - 1);
    if (scrollLockCount === 0) {
      removeScrollLock();
    }
  };
}

export function hideHomeTransitionOverlay() {
  document.getElementById(OVERLAY_ID)?.remove();
}

/** Unconditionally reset scroll lock state — safe to call on every home entry. */
export function forceResetHomeDocument() {
  homeScrollUnlock?.();
  homeScrollUnlock = null;
  scrollLockCount = 0;
  scrollLockSnapshot = null;

  if (typeof document === "undefined") return;

  const html = document.documentElement;
  const body = document.body;

  html.classList.remove("home-arc-lock");
  html.style.overflow = "";
  html.style.height = "";
  html.style.maxHeight = "";

  body.style.position = "";
  body.style.top = "";
  body.style.left = "";
  body.style.right = "";
  body.style.width = "";
  body.style.minHeight = "";
  body.style.overflow = "";
  body.style.width = "";
  body.style.maxWidth = "";

  hideHomeTransitionOverlay();
  window.scrollTo(0, 0);
}

export function ensureHomeScrollLock() {
  if (!isDesktopViewport()) return;
  if (homeScrollUnlock) return;
  homeScrollUnlock = acquireScrollLock(`-${window.scrollY}px`);
}

export function releaseHomeScrollLock() {
  homeScrollUnlock?.();
  homeScrollUnlock = null;
}

/** Mobile home scrolls; project navigations use scroll:false — reset to top on entry. */
export function resetMobileProjectPageScroll() {
  if (typeof window === "undefined") return;
  if (isDesktopViewport()) return;
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}
