/**
 * Detects whether the current page load is a browser refresh (Ctrl+R, F5)
 * rather than a Next.js client-side navigation.
 *
 * Strategy: a `beforeunload` listener writes a flag to sessionStorage on every
 * full document unload (refresh, tab close, external nav). On the next load,
 * we read and clear the flag. Next.js client-side navigation (`<Link>`,
 * `router.push`) does NOT fire `beforeunload`, so the flag stays cleared.
 */

const RELOAD_FLAG_KEY = "page-reload-pending";
const RELOAD_PATH_KEY = "page-reload-path";

let reloadStateRead = false;
let documentWasReloaded = false;
let reloadPathAtUnload: string | null = null;
let listenerRegistered = false;

function handleBeforeUnload() {
  try {
    sessionStorage.setItem(RELOAD_FLAG_KEY, "1");
    sessionStorage.setItem(RELOAD_PATH_KEY, window.location.pathname);
  } catch {
    // Storage unavailable — ignore.
  }
}

function registerListener() {
  if (listenerRegistered) return;
  listenerRegistered = true;
  window.addEventListener("beforeunload", handleBeforeUnload);
}

function readReloadState() {
  if (reloadStateRead) return;
  reloadStateRead = true;

  try {
    documentWasReloaded = sessionStorage.getItem(RELOAD_FLAG_KEY) === "1";
    reloadPathAtUnload = sessionStorage.getItem(RELOAD_PATH_KEY);
    sessionStorage.removeItem(RELOAD_FLAG_KEY);
    sessionStorage.removeItem(RELOAD_PATH_KEY);
  } catch {
    documentWasReloaded = false;
    reloadPathAtUnload = null;
  }
}

if (typeof window !== "undefined") {
  registerListener();
}

/** Safe to call from any client component; idempotent. */
export function initPageReloadDetection() {
  if (typeof window === "undefined") return;
  registerListener();
  readReloadState();
}

/** True if the current document load resulted from refreshing the given path. */
export function wasPageReloaded(path: string): boolean {
  if (typeof window === "undefined") return false;
  readReloadState();

  if (!documentWasReloaded || reloadPathAtUnload !== path) return false;

  // Consume — only triggers once per actual page reload, not on client navigations
  // that reuse the same JS session within the same document.
  documentWasReloaded = false;
  reloadPathAtUnload = null;
  return true;
}

/**
 * True on the first paint of a full document load (direct visit or refresh).
 * Client-side Next.js navigations reuse the same document and keep the original
 * navigation entry, so this stays false after the first route change.
 */
export function isInitialDocumentLoad(): boolean {
  if (typeof window === "undefined") return false;

  const nav = performance.getEntriesByType(
    "navigation",
  )[0] as PerformanceNavigationTiming | undefined;

  return nav?.type === "navigate" || nav?.type === "reload";
}

export function skipHomeEntranceAnimations() {
  if (typeof document === "undefined") return;
  document.documentElement.classList.add("skip-home-entrance");
}
