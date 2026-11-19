/** Visitor and site chat caps. Safe to import from the browser. */
export const CHAT_BURST_LIMIT = 10;
export const CHAT_BURST_WINDOW_LABEL = "10 minutes";
export const CHAT_VISITOR_DAILY_LIMIT = 40;
export const CHAT_SITE_DAILY_DEFAULT = 500;

export type ChatQuota = {
  burstLimit: number;
  burstRemaining: number;
  dailyLimit: number;
  dailyRemaining: number;
  siteLimit: number;
  siteRemaining: number;
};

export function quotaHeaders(quota: ChatQuota): Record<string, string> {
  return {
    "x-chat-burst-limit": String(quota.burstLimit),
    "x-chat-burst-remaining": String(quota.burstRemaining),
    "x-chat-daily-limit": String(quota.dailyLimit),
    "x-chat-daily-remaining": String(quota.dailyRemaining),
    "x-chat-site-limit": String(quota.siteLimit),
    "x-chat-site-remaining": String(quota.siteRemaining),
  };
}

export function quotaFromHeaders(headers: Headers): ChatQuota | null {
  const burstRemaining = headers.get("x-chat-burst-remaining");
  const dailyRemaining = headers.get("x-chat-daily-remaining");
  const siteRemaining = headers.get("x-chat-site-remaining");
  if (burstRemaining == null || dailyRemaining == null || siteRemaining == null) return null;
  return {
    burstLimit: Number(headers.get("x-chat-burst-limit")) || CHAT_BURST_LIMIT,
    burstRemaining: Number(burstRemaining),
    dailyLimit: Number(headers.get("x-chat-daily-limit")) || CHAT_VISITOR_DAILY_LIMIT,
    dailyRemaining: Number(dailyRemaining),
    siteLimit: Number(headers.get("x-chat-site-limit")) || CHAT_SITE_DAILY_DEFAULT,
    siteRemaining: Number(siteRemaining),
  };
}
