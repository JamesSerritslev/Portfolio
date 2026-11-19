import { createHmac, randomBytes } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { CHAT_COPY } from "@/lib/chat-copy";
import {
  CHAT_BURST_LIMIT,
  CHAT_SITE_DAILY_DEFAULT,
  CHAT_VISITOR_DAILY_LIMIT,
  type ChatQuota,
} from "@/lib/chat-limits";
import { SITE_URL } from "@/lib/site";

const SESSION_COOKIE = "chat_sid";
const MAX_MESSAGE_CHARS = 500;
const MAX_HISTORY = 10;

export type ChatTurn = {
  id: string;
  role: "user" | "assistant";
  parts: [{ type: "text"; text: string }];
};

type GuardOk = {
  ok: true;
  messages: ChatTurn[];
  cookie: string;
  sessionId: string;
  ipHash: string;
  quota: ChatQuota;
};
type GuardNo = { ok: false; status: number; message: string; cookie: string; quota?: ChatQuota };

let redis: Redis | null = null;
let burst: Ratelimit | null = null;

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  redis ??= Redis.fromEnv();
  return redis;
}

function getBurst(): Ratelimit | null {
  const client = getRedis();
  if (!client) return null;
  burst ??= new Ratelimit({
    redis: client,
    limiter: Ratelimit.slidingWindow(CHAT_BURST_LIMIT, "10 m"),
    prefix: "chat:burst",
    analytics: false,
  });
  return burst;
}

export function hashIp(ip: string): string {
  const salt = process.env.GROQ_API_KEY || "portfolio-chat";
  return createHmac("sha256", salt).update(ip).digest("hex").slice(0, 16);
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    return false;
  }

  if (process.env.NODE_ENV !== "production") {
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return true;
  }

  const allowed = new Set<string>([
    new URL(SITE_URL).host,
    "www.jamesserritslev.com",
  ]);
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) {
    try {
      allowed.add(new URL(configured).host);
    } catch {
      // Ignore a malformed site URL.
    }
  }

  return url.protocol === "https:" && allowed.has(url.host);
}

export function isAllowedRead(request: Request): boolean {
  if (isAllowedOrigin(request.headers.get("origin"))) return true;
  const site = request.headers.get("sec-fetch-site");
  if (site === "same-origin" || site === "same-site") return true;
  const referer = request.headers.get("referer");
  if (!referer) return false;
  try {
    return isAllowedOrigin(new URL(referer).origin);
  } catch {
    return false;
  }
}

function readSessionId(request: Request): string | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name !== SESSION_COOKIE) continue;
    const value = decodeURIComponent(rest.join("="));
    if (/^[a-f0-9]{32}$/.test(value)) return value;
  }
  return null;
}

export function sessionCookie(sessionId: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${sessionId}; HttpOnly; SameSite=Lax; Path=/; Max-Age=86400${secure}`;
}

function utcDay(): string {
  return new Date().toISOString().slice(0, 10);
}

function secondsUntilUtcMidnight(): number {
  const now = Date.now();
  const date = new Date(now);
  const next = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1);
  return Math.max(60, Math.ceil((next - now) / 1000));
}

async function incrementDaily(key: string): Promise<number> {
  const client = getRedis();
  if (!client) throw new Error("redis-missing");
  const count = await client.incr(key);
  if (count === 1) {
    await client.expire(key, secondsUntilUtcMidnight());
  }
  return count;
}

function siteDailyCap(): number {
  const parsed = Number(process.env.CHAT_DAILY_CAP);
  if (!Number.isFinite(parsed) || parsed < 1) return CHAT_SITE_DAILY_DEFAULT;
  return Math.floor(parsed);
}

function emptyQuota(): ChatQuota {
  const siteLimit = siteDailyCap();
  return {
    burstLimit: CHAT_BURST_LIMIT,
    burstRemaining: CHAT_BURST_LIMIT,
    dailyLimit: CHAT_VISITOR_DAILY_LIMIT,
    dailyRemaining: CHAT_VISITOR_DAILY_LIMIT,
    siteLimit,
    siteRemaining: siteLimit,
  };
}

async function siteUsage(): Promise<number> {
  const client = getRedis();
  if (!client) return 0;
  const value = await client.get<number>(`chat:global:${utcDay()}`);
  return Number(value ?? 0);
}

function messageText(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const parts = (value as { parts?: unknown }).parts;
  if (!Array.isArray(parts)) return null;
  const text = parts
    .filter(
      (part): part is { type: "text"; text: string } =>
        !!part &&
        typeof part === "object" &&
        (part as { type?: unknown }).type === "text" &&
        typeof (part as { text?: unknown }).text === "string",
    )
    .map((part) => part.text.trim())
    .filter(Boolean)
    .join("\n");
  return text || null;
}

export function sanitizeMessages(input: unknown): ChatTurn[] | null {
  if (!Array.isArray(input)) return null;
  const turns: ChatTurn[] = [];
  for (const item of input) {
    if (!item || typeof item !== "object") continue;
    const role = (item as { role?: unknown }).role;
    if (role !== "user" && role !== "assistant") continue;
    const text = messageText(item);
    if (!text || text.length > MAX_MESSAGE_CHARS) continue;
    turns.push({
      id: randomBytes(8).toString("hex"),
      role,
      parts: [{ type: "text", text }],
    });
  }
  const recent = turns.slice(-MAX_HISTORY);
  const latest = recent.at(-1);
  if (!latest || latest.role !== "user") return null;
  return recent;
}

export async function guardChatRequest(
  request: Request,
  messages: unknown,
): Promise<GuardOk | GuardNo> {
  const existing = readSessionId(request);
  const sessionId = existing ?? randomBytes(16).toString("hex");
  const cookie = sessionCookie(sessionId);
  const ipHash = hashIp(clientIp(request));

  if (!getRedis() || !process.env.GROQ_API_KEY || !process.env.TURNSTILE_SECRET_KEY) {
    return { ok: false, status: 503, message: CHAT_COPY.unavailable, cookie };
  }

  const limiter = getBurst();
  if (!limiter) {
    return { ok: false, status: 503, message: CHAT_COPY.unavailable, cookie };
  }

  const visitorKey = `${ipHash}:${sessionId}`;
  const burstResult = await limiter.limit(visitorKey);
  const siteUsed = await siteUsage();
  const quotaBase = {
    burstLimit: burstResult.limit,
    burstRemaining: burstResult.remaining,
    dailyLimit: CHAT_VISITOR_DAILY_LIMIT,
    siteLimit: siteDailyCap(),
    siteRemaining: Math.max(0, siteDailyCap() - siteUsed),
  };
  if (!burstResult.success) {
    return {
      ok: false,
      status: 429,
      message: CHAT_COPY.visitorLimit,
      cookie,
      quota: { ...quotaBase, dailyRemaining: CHAT_VISITOR_DAILY_LIMIT },
    };
  }

  const visitorCount = await incrementDaily(`chat:visitor:${visitorKey}:${utcDay()}`);
  const quota: ChatQuota = {
    ...quotaBase,
    dailyRemaining: Math.max(0, CHAT_VISITOR_DAILY_LIMIT - visitorCount),
  };
  if (visitorCount > CHAT_VISITOR_DAILY_LIMIT) {
    return { ok: false, status: 429, message: CHAT_COPY.visitorLimit, cookie, quota };
  }

  const clean = sanitizeMessages(messages);
  if (!clean) {
    return { ok: false, status: 400, message: CHAT_COPY.tooLong, cookie, quota };
  }

  return { ok: true, messages: clean, cookie, sessionId, ipHash, quota };
}

export async function readChatQuota(request: Request): Promise<{ cookie: string; quota: ChatQuota }> {
  const existing = readSessionId(request);
  const sessionId = existing ?? randomBytes(16).toString("hex");
  const cookie = sessionCookie(sessionId);
  const quota = emptyQuota();
  const client = getRedis();
  const limiter = getBurst();
  if (!client || !limiter) return { cookie, quota };

  const visitorKey = `${hashIp(clientIp(request))}:${sessionId}`;
  try {
    const [burst, visitorCount, siteUsed] = await Promise.all([
      limiter.getRemaining(visitorKey),
      client.get<number>(`chat:visitor:${visitorKey}:${utcDay()}`),
      siteUsage(),
    ]);
    const usedToday = Number(visitorCount ?? 0);
    return {
      cookie,
      quota: {
        burstLimit: burst.limit || CHAT_BURST_LIMIT,
        burstRemaining: burst.remaining,
        dailyLimit: CHAT_VISITOR_DAILY_LIMIT,
        dailyRemaining: Math.max(0, CHAT_VISITOR_DAILY_LIMIT - usedToday),
        siteLimit: siteDailyCap(),
        siteRemaining: Math.max(0, siteDailyCap() - siteUsed),
      },
    };
  } catch {
    return { cookie, quota };
  }
}

export async function consumeSiteCap(
  cookie: string,
  quota: ChatQuota,
): Promise<{ blocked: GuardNo | null; quota: ChatQuota }> {
  const count = await incrementDaily(`chat:global:${utcDay()}`);
  const next: ChatQuota = {
    ...quota,
    siteRemaining: Math.max(0, quota.siteLimit - count),
  };
  if (count > quota.siteLimit) {
    return {
      blocked: { ok: false, status: 429, message: CHAT_COPY.dailyLimit, cookie, quota: next },
      quota: next,
    };
  }
  return { blocked: null, quota: next };
}

export async function assertHuman(
  request: Request,
  sessionId: string,
  token: unknown,
  cookie: string,
): Promise<GuardNo | null> {
  const client = getRedis();
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!client || !secret) {
    return { ok: false, status: 503, message: CHAT_COPY.unavailable, cookie };
  }

  const key = `chat:human:${sessionId}`;
  const already = await client.get(key);
  if (already) return null;

  if (typeof token !== "string" || token.length < 10 || token.length > 2048) {
    return { ok: false, status: 403, message: CHAT_COPY.human, cookie };
  }

  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: clientIp(request),
  });
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const result = (await response.json()) as { success?: boolean };
  if (!result.success) {
    return { ok: false, status: 403, message: CHAT_COPY.human, cookie };
  }

  await client.set(key, "1", { ex: secondsUntilUtcMidnight() });
  return null;
}
