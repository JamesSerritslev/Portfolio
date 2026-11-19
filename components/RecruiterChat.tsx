"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { isChatPath } from "@/lib/chat-paths";
import { CHAT_COPY } from "@/lib/chat-copy";
import {
  CHAT_BURST_LIMIT,
  CHAT_BURST_WINDOW_LABEL,
  CHAT_SITE_DAILY_DEFAULT,
  CHAT_VISITOR_DAILY_LIMIT,
  quotaFromHeaders,
  type ChatQuota,
} from "@/lib/chat-limits";
import { prepareChatPageTransition, scheduleTransitionNavigation } from "@/lib/navigation-transition";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const MODE_KEY = "recruiter-chat-mode";
const HUMAN_KEY = "recruiter-chat-human";

type ChatMode = "center" | "dock" | "min";

const MOBILE_CHAT_QUERY = "(max-width: 767px)";

function isMobileChat() {
  return window.matchMedia(MOBILE_CHAT_QUERY).matches;
}

function openedChatMode(): ChatMode {
  return isMobileChat() ? "center" : "dock";
}

type TurnstileApi = {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      theme?: "light";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => string;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const STARTERS = [
  "What has James built?",
  "What's his experience?",
  "Tell me about BandScope",
] as const;

function quotaCount(limit: number, remaining: number) {
  const left = Math.max(0, remaining);
  const made = Math.max(0, limit - left);
  return { made, left };
}

function quotaLabel(quota: ChatQuota | null): string {
  if (!quota) {
    return `0 made · ${CHAT_BURST_LIMIT} left this ${CHAT_BURST_WINDOW_LABEL}\n0 made · ${CHAT_VISITOR_DAILY_LIMIT} left today\n0 made · ${CHAT_SITE_DAILY_DEFAULT} left for the site today`;
  }
  const burst = quotaCount(quota.burstLimit, quota.burstRemaining);
  const daily = quotaCount(quota.dailyLimit, quota.dailyRemaining);
  const site = quotaCount(quota.siteLimit, quota.siteRemaining);
  return `${burst.made} made · ${burst.left} left this ${CHAT_BURST_WINDOW_LABEL}\n${daily.made} made · ${daily.left} left today\n${site.made} made · ${site.left} left for the site today`;
}

function messageText(parts: Array<{ type: string; text?: string }>): string {
  return parts
    .filter((part) => part.type === "text" && typeof part.text === "string")
    .map((part) => part.text)
    .join("\n");
}

function navigatePath(part: {
  type: string;
  state?: string;
  toolName?: string;
  output?: unknown;
  toolCallId?: string;
}): string | null {
  const isNavigate =
    part.type === "tool-navigate" ||
    (part.type === "dynamic-tool" && part.toolName === "navigate");
  if (!isNavigate || part.state !== "output-available" || !part.toolCallId) return null;
  const output = part.output;
  if (!output || typeof output !== "object") return null;
  const path = (output as { ok?: unknown; path?: unknown }).path;
  const ok = (output as { ok?: unknown }).ok;
  if (ok !== true || !isChatPath(path)) return null;
  return path;
}

function ChatMarkdown({ text }: { text: string }) {
  return (
    <ReactMarkdown
      skipHtml
      components={{
        a: ({ href, children }) => {
          if (!href || !/^https?:\/\//i.test(href)) return <span>{children}</span>;
          return (
            <a href={href} target="_blank" rel="noopener noreferrer" className="underline">
              {children}
            </a>
          );
        },
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="mb-2 list-disc pl-4 last:mb-0">{children}</ul>,
        ol: ({ children }) => <ol className="mb-2 list-decimal pl-4 last:mb-0">{children}</ol>,
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

function Turnstile({ onToken }: { onToken: (token: string | null) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!SITE_KEY || !containerRef.current) return;
    let widgetId: string | undefined;
    let cancelled = false;

    const render = () => {
      if (cancelled || !containerRef.current || !window.turnstile) return;
      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        theme: "light",
        callback: (token) => onToken(token),
        "expired-callback": () => onToken(null),
        "error-callback": () => onToken(null),
      });
    };

    if (window.turnstile) {
      render();
    } else {
      const existing = document.querySelector<HTMLScriptElement>(
        'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"]',
      );
      const script = existing ?? document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.addEventListener("load", render);
      if (!existing) document.head.appendChild(script);
      return () => {
        cancelled = true;
        script.removeEventListener("load", render);
        if (widgetId) window.turnstile?.remove(widgetId);
      };
    }

    return () => {
      cancelled = true;
      if (widgetId) window.turnstile?.remove(widgetId);
    };
  }, [onToken]);

  return <div ref={containerRef} className="min-h-[65px]" />;
}

function radiusPx(mode: ChatMode) {
  if (mode === "center") return 28;
  if (mode === "dock") return 16;
  return 24;
}

function shellFrame(box: DOMRect, radius: number): Keyframe {
  return {
    left: `${box.left}px`,
    top: `${box.top}px`,
    width: `${box.width}px`,
    height: `${box.height}px`,
    maxWidth: `${box.width}px`,
    maxHeight: `${box.height}px`,
    minWidth: "0px",
    minHeight: "0px",
    right: "auto",
    bottom: "auto",
    margin: "0",
    transform: "none",
    borderRadius: `${radius}px`,
  };
}

function playMorph(
  panel: HTMLElement,
  body: HTMLElement | null,
  from: DOMRect,
  to: DOMRect,
  fromMode: ChatMode,
  next: ChatMode,
) {
  if (to.width < 1 || to.height < 1 || from.width < 1 || from.height < 1) return null;
  const shrinking = to.width * to.height < from.width * from.height * 0.92;
  const duration = shrinking ? 320 : 380;
  const easing = shrinking ? "cubic-bezier(0.4, 0, 0.2, 1)" : "cubic-bezier(0.16, 1, 0.3, 1)";
  const animations: Animation[] = [
    panel.animate([shellFrame(from, radiusPx(fromMode)), shellFrame(to, radiusPx(next))], {
      duration,
      easing,
      fill: "both",
    }),
  ];
  if (next === "min") {
    animations.push(
      panel.animate(
        [
          { opacity: 1, offset: 0 },
          { opacity: 1, offset: 0.42 },
          { opacity: 0, offset: 0.88 },
          { opacity: 0, offset: 1 },
        ],
        { duration, easing: "linear", fill: "both" },
      ),
    );
    if (body) {
      animations.push(
        body.animate(
          [
            { opacity: 1, offset: 0 },
            { opacity: 0, offset: 0.4 },
            { opacity: 0, offset: 1 },
          ],
          { duration, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "both" },
        ),
      );
    }
  } else if (fromMode === "min") {
    animations.push(
      panel.animate(
        [
          { opacity: 0, offset: 0 },
          { opacity: 1, offset: 0.34 },
          { opacity: 1, offset: 1 },
        ],
        { duration, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "both" },
      ),
    );
    if (body) {
      animations.push(
        body.animate(
          [
            { opacity: 0, offset: 0 },
            { opacity: 0, offset: 0.18 },
            { opacity: 1, offset: 0.62 },
            { opacity: 1, offset: 1 },
          ],
          { duration, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "both" },
        ),
      );
    }
  } else if (body) {
    animations.push(
      body.animate(
        shrinking
          ? [
              { opacity: 1, offset: 0 },
              { opacity: 0, offset: 0.3 },
              { opacity: 0, offset: 0.48 },
              { opacity: 1, offset: 0.82 },
              { opacity: 1, offset: 1 },
            ]
          : [
              { opacity: 0, offset: 0 },
              { opacity: 0, offset: 0.14 },
              { opacity: 1, offset: 0.62 },
              { opacity: 1, offset: 1 },
            ],
        {
          duration,
          easing: shrinking ? "ease-in-out" : "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "both",
        },
      ),
    );
  }
  return animations;
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface hover:text-foreground"
    >
      {children}
    </button>
  );
}

export function RecruiterChat() {
  const router = useRouter();
  const pathname = usePathname();
  const [quota, setQuota] = useState<ChatQuota | null>(null);
  const [limitsOpen, setLimitsOpen] = useState(false);
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        fetch: async (input, init) => {
          const response = await fetch(input, init);
          const next = quotaFromHeaders(response.headers);
          if (next) setQuota(next);
          return response;
        },
      }),
    [],
  );
  const { messages, sendMessage, status, error, clearError } = useChat({ transport });
  const [mode, setMode] = useState<ChatMode>("min");
  const [hydrated, setHydrated] = useState(false);
  const [draft, setDraft] = useState("");
  const [human, setHuman] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const seenTools = useRef(new Set<string>());
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const modeRef = useRef<ChatMode>("min");
  const pendingMorph = useRef<{ from: DOMRect; fromMode: ChatMode } | null>(null);
  const morphGeneration = useRef(0);
  const morphRef = useRef<(next: ChatMode) => void>(() => {});
  const skipIntro = useRef(false);
  const busy = status === "submitted" || status === "streaming";

  const morph = (next: ChatMode) => {
    if (modeRef.current === next) return;
    skipIntro.current = true;
    morphGeneration.current += 1;
    const panel = panelRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (panel && hydrated && !reduce) {
      pendingMorph.current = { from: panel.getBoundingClientRect(), fromMode: modeRef.current };
    } else {
      pendingMorph.current = null;
    }
    modeRef.current = next;
    setMode(next);
    try {
      sessionStorage.setItem(MODE_KEY, next);
    } catch {
      // Ignore storage errors.
    }
  };
  morphRef.current = morph;

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (modeRef.current === "min") return;
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (panelRef.current?.contains(target)) return;
      if (launcherRef.current?.contains(target)) return;
      morphRef.current("min");
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, []);

  useLayoutEffect(() => {
    const generation = morphGeneration.current;
    const pending = pendingMorph.current;
    const panel = panelRef.current;
    if (!pending || !panel) return;
    pendingMorph.current = null;
    const body = bodyRef.current;
    for (const element of [panel, body]) {
      element?.getAnimations().forEach((animation) => animation.cancel());
    }
    if (body) {
      body.style.position = "";
      body.style.right = "";
      body.style.bottom = "";
      body.style.width = "";
      body.style.height = "";
    }
    const to = panel.getBoundingClientRect();
    const toMin = mode === "min";
    const lockWidth = toMin ? pending.from.width : to.width;
    const lockHeight = toMin ? pending.from.height : to.height;
    if (body) {
      body.style.position = "absolute";
      body.style.right = "0";
      body.style.bottom = "0";
      body.style.width = `${lockWidth}px`;
      body.style.height = `${lockHeight}px`;
    }
    const unlock = () => {
      if (!body) return;
      body.style.position = "";
      body.style.right = "";
      body.style.bottom = "";
      body.style.width = "";
      body.style.height = "";
    };
    const animations = playMorph(panel, body, pending.from, to, pending.fromMode, mode);
    if (!animations) {
      unlock();
      return;
    }
    const start = document.timeline.currentTime;
    if (start != null) {
      for (const animation of animations) animation.startTime = start;
    }
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      for (const animation of animations) animation.cancel();
      unlock();
    };
    Promise.all(animations.map((animation) => animation.finished))
      .then(finish)
      .catch(() => {});
    return () => {
      finish();
      if (morphGeneration.current === generation && pendingMorph.current === null) {
        pendingMorph.current = pending;
      }
    };
  }, [mode]);

  useEffect(() => {
    modeRef.current = "min";
    setMode("min");
    try {
      sessionStorage.setItem(MODE_KEY, "min");
      if (sessionStorage.getItem(HUMAN_KEY) === "1") setHuman(true);
    } catch {
      // Storage can be blocked.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_CHAT_QUERY);
    const onChange = () => {
      if (media.matches && modeRef.current === "dock") morphRef.current("center");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const timer = window.setTimeout(() => {
      if (skipIntro.current || modeRef.current !== "min") return;
      morphRef.current(openedChatMode());
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [hydrated]);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      fetch("/api/chat", { headers: { "x-chat-quota": "1" } })
        .then(async (response) => {
          if (!response.ok) return null;
          return (await response.json()) as ChatQuota;
        })
        .then((next) => {
          if (!cancelled && next && typeof next.burstRemaining === "number") setQuota(next);
        })
        .catch(() => {
          // The static limit line still shows.
        });
    };
    load();
    const timer = window.setInterval(load, 15_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, mode, error]);

  useEffect(() => {
    if (status !== "ready" || error) return;
    if (!messages.some((message) => message.role === "assistant")) return;
    setHuman(true);
    try {
      sessionStorage.setItem(HUMAN_KEY, "1");
    } catch {
      // Ignore storage errors.
    }
  }, [status, error, messages]);

  useEffect(() => {
    if (!error || !error.message.includes(CHAT_COPY.human)) return;
    setHuman(false);
    setToken(null);
    try {
      sessionStorage.removeItem(HUMAN_KEY);
    } catch {
      // Ignore storage errors.
    }
  }, [error]);

  useEffect(() => {
    for (const message of messages) {
      for (const part of message.parts) {
        const path = navigatePath(part as {
          type: string;
          state?: string;
          toolName?: string;
          output?: unknown;
          toolCallId?: string;
        });
        if (!path) continue;
        const id = (part as { toolCallId?: string }).toolCallId;
        if (!id || seenTools.current.has(id) || pathname === path) {
          if (id) seenTools.current.add(id);
          continue;
        }
        seenTools.current.add(id);
        if (modeRef.current === "center") {
          morphRef.current(isMobileChat() ? "min" : "dock");
        }
        const prepare = prepareChatPageTransition(pathname, path);
        if (prepare) {
          scheduleTransitionNavigation(path, prepare, (href) => {
            router.push(href, { scroll: false });
          });
        } else {
          router.push(path, { scroll: false });
        }
      }
    }
  }, [messages, pathname, router]);

  const submit = async (text: string) => {
    const value = text.trim();
    if (!value || value.length > 500 || busy) return;
    if (SITE_KEY && !human && !token) return;
    clearError();
    setDraft("");
    await sendMessage({ text: value }, { body: { turnstileToken: token } });
  };

  const corner =
    "bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))]";

  return (
    <div
      data-recruiter-chat=""
      className={cn("pointer-events-none fixed inset-0 z-[80]", !hydrated && "invisible")}
    >
      <button
        type="button"
        aria-label="Minimize chat"
        tabIndex={mode === "center" ? 0 : -1}
        aria-hidden={mode !== "center"}
        onClick={() => morph("min")}
        className={cn(
          "absolute inset-0 bg-[#1F1C16]/35 transition-opacity duration-300 ease-out",
          mode === "center" ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <button
        ref={launcherRef}
        type="button"
        onClick={() => morph(openedChatMode())}
        aria-label="Open chat about James"
        tabIndex={mode === "min" ? 0 : -1}
        aria-hidden={mode !== "min"}
        className={cn(
          "fixed z-[1] flex h-12 w-12 items-center justify-center rounded-full border border-[#9F956C]/50 bg-surface-elevated font-serif text-lg text-gold shadow-[0_8px_24px_rgba(31,28,22,0.14)] transition-opacity ease-out hover:border-gold",
          corner,
          mode === "min"
            ? "chat-launcher-pulse pointer-events-auto opacity-100 duration-200 delay-100"
            : "pointer-events-none opacity-0 duration-150 delay-0",
        )}
      >
        J
      </button>
      <section
        ref={panelRef}
        aria-label="Ask about James"
        aria-hidden={mode === "min"}
        className={cn(
          "fixed z-[2] flex min-h-0 min-w-0 flex-col overflow-hidden border border-[#9F956C]/45 bg-surface-elevated shadow-[0_24px_70px_rgba(31,28,22,0.18)]",
          mode === "center" &&
            "inset-0 m-auto h-[min(36rem,calc(100dvh-2rem))] w-[min(40rem,calc(100vw-2rem))] rounded-[28px] opacity-100",
          mode === "dock" &&
            cn(
              corner,
              "max-h-[min(32rem,calc(100dvh-2rem))] w-[min(22rem,calc(100vw-2rem))] rounded-2xl opacity-100",
            ),
          mode === "min" &&
            cn(corner, "pointer-events-none h-12 w-12 rounded-full opacity-0"),
          mode !== "min" && "pointer-events-auto",
        )}
        {...(mode === "min" ? { inert: true } : {})}
      >
        <div ref={bodyRef} className="flex h-full min-h-0 w-full flex-col">
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-[#9F956C]/30 px-4 py-3 sm:px-5">
          <div>
            <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-gold">
              Portfolio assistant
            </p>
            <h2 className="font-serif text-2xl text-foreground">Ask about James</h2>
            <button
              type="button"
              aria-expanded={limitsOpen}
              onClick={() => setLimitsOpen((open) => !open)}
              className="mt-1 rounded-full border border-[#9F956C]/45 px-2.5 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-gold transition-colors hover:border-gold hover:text-foreground"
            >
              API Limits
            </button>
            {limitsOpen ? (
              <p className="mt-1 max-w-md whitespace-pre-line font-sans text-[10px] leading-snug text-text-muted">
                {quotaLabel(quota)}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <div className="hidden md:contents">
            {mode === "dock" ? (
              <IconButton label="Enlarge chat" onClick={() => morph("center")}>
                <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
                  <path
                    d="M6 2.5H2.5V6M10 2.5h3.5V6M6 13.5H2.5V10M10 13.5h3.5V10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </IconButton>
            ) : (
              <IconButton label="Move chat to the corner" onClick={() => morph("dock")}>
                <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
                  <rect
                    x="8"
                    y="8"
                    width="5.5"
                    height="5.5"
                    rx="1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M3 3h5.5M3 3v5.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </IconButton>
            )}
            </div>
            <IconButton
              label="Minimize chat"
              onClick={() => {
                morph("min");
                requestAnimationFrame(() => launcherRef.current?.focus());
              }}
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </IconButton>
          </div>
        </header>

        <div ref={listRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
          <p className="font-sans text-sm leading-relaxed text-text-muted">
            Ask about James’s work, or paste a job description and I’ll compare it to his background.
          </p>
          <div className="flex flex-wrap gap-2">
            {STARTERS.map((starter) => (
              <button
                key={starter}
                type="button"
                disabled={busy}
                onClick={() => submit(starter)}
                className="rounded-full border border-[#9F956C]/45 px-3 py-1 font-sans text-xs text-gold transition-colors hover:border-gold hover:text-foreground disabled:opacity-50"
              >
                {starter}
              </button>
            ))}
            <button
              type="button"
              onClick={() => inputRef.current?.focus()}
              className="rounded-full border border-[#9F956C]/45 px-3 py-1 font-sans text-xs text-gold transition-colors hover:border-gold hover:text-foreground"
            >
              Paste a job description
            </button>
          </div>
          {messages.map((message) => {
            const text = messageText(message.parts);
            if (!text || message.role === "system") return null;
            const mine = message.role === "user";
            return (
              <div
                key={message.id}
                className={cn(
                  "rounded-xl px-3 py-2 font-sans text-sm leading-relaxed",
                  mine ? "ml-6 bg-surface text-foreground" : "mr-2 text-foreground",
                )}
              >
                {mine ? <p className="whitespace-pre-wrap">{text}</p> : <ChatMarkdown text={text} />}
              </div>
            );
          })}
          {error ? (
            <p className="font-sans text-sm leading-relaxed text-gold" role="status">
              {error.message || CHAT_COPY.failed}
            </p>
          ) : null}
        </div>

        <form
          className="shrink-0 border-t border-[#9F956C]/30 px-4 py-3"
          onSubmit={(event) => {
            event.preventDefault();
            void submit(draft);
          }}
        >
          {SITE_KEY && !human ? <Turnstile onToken={setToken} /> : null}
          {!SITE_KEY ? (
            <p className="mb-2 font-sans text-xs text-text-muted">
              The assistant needs a Turnstile site key before it can answer.
            </p>
          ) : null}
          <textarea
            ref={inputRef}
            value={draft}
            maxLength={500}
            rows={mode === "center" ? 4 : 2}
            placeholder="Ask about James, or paste a job description"
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void submit(draft);
              }
            }}
            className="w-full resize-none rounded-xl border border-[#9F956C]/40 bg-background px-3 py-2 font-sans text-base text-foreground outline-none placeholder:text-text-placeholder focus:border-gold md:text-sm"
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="font-sans text-[10px] text-text-muted">{draft.length}/500</span>
            <button
              type="submit"
              disabled={busy || !draft.trim() || (!!SITE_KEY && !human && !token)}
              className="rounded-full bg-gold px-4 py-1.5 font-sans text-xs text-white transition-opacity disabled:opacity-40"
            >
              {busy ? "Thinking" : "Send"}
            </button>
          </div>
        </form>
        </div>
      </section>
    </div>
  );
}
