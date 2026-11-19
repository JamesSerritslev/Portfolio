import { createGroq } from "@ai-sdk/groq";
import { APICallError, convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse, stepCountIs, streamText, tool } from "ai";
import { z } from "zod";
import { CHAT_COPY } from "@/lib/chat-copy";
import { visitorIsOutOfScope } from "@/lib/chat-scope";
import {
  assertHuman,
  clientIp,
  consumeSiteCap,
  guardChatRequest,
  hashIp,
  isAllowedOrigin,
  isAllowedRead,
  readChatQuota,
  type ChatTurn,
} from "@/lib/chat-guard";
import { CHAT_PATHS, isChatPath } from "@/lib/chat-paths";
import { buildChatSystemPrompt } from "@/lib/chat-prompt";
import { quotaHeaders, type ChatQuota } from "@/lib/chat-limits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const navigate = tool({
  description:
    "Open a portfolio page when the answer is about that project or the resume. Use only a path from the enum.",
  inputSchema: z.object({
    path: z.enum(CHAT_PATHS),
  }),
  execute: async ({ path }) => {
    if (!isChatPath(path)) return { ok: false as const };
    return { ok: true as const, path };
  },
});

function withCookie(response: Response, cookie: string, quota?: ChatQuota): Response {
  const headers = new Headers(response.headers);
  headers.append("set-cookie", cookie);
  if (quota) {
    for (const [key, value] of Object.entries(quotaHeaders(quota))) {
      headers.set(key, value);
    }
  }
  return new Response(response.body, { status: response.status, headers });
}

function text(message: string, status: number, cookie: string, quota?: ChatQuota): Response {
  return new Response(message, {
    status,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "set-cookie": cookie,
      ...(quota ? quotaHeaders(quota) : {}),
    },
  });
}

function forModel(messages: ChatTurn[]): ChatTurn[] {
  return messages.map((message) =>
    message.role === "user"
      ? {
          ...message,
          parts: [
            {
              type: "text",
              text: `<visitor>\n${message.parts[0].text}\n</visitor>`,
            },
          ],
        }
      : message,
  );
}

function cannedReply(message: string, cookie: string, quota: ChatQuota) {
  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      const id = "scope";
      writer.write({ type: "text-start", id });
      writer.write({ type: "text-delta", id, delta: message });
      writer.write({ type: "text-end", id });
    },
  });
  return withCookie(createUIMessageStreamResponse({ stream }), cookie, quota);
}

function logUsage(entry: {
  ipHash: string;
  inputTokens?: number;
  outputTokens?: number;
  error?: string;
}) {
  const key = process.env.GROQ_API_KEY;
  const error = entry.error && key ? entry.error.replaceAll(key, "[redacted]") : entry.error;
  console.info(
    JSON.stringify({
      source: "chat",
      timestamp: new Date().toISOString(),
      ipHash: entry.ipHash,
      inputTokens: entry.inputTokens,
      outputTokens: entry.outputTokens,
      error,
    }),
  );
}

export async function GET(request: Request) {
  if (!isAllowedRead(request)) {
    return new Response(CHAT_COPY.forbidden, { status: 403 });
  }
  const { cookie, quota } = await readChatQuota(request);
  return Response.json(quota, {
    headers: {
      "set-cookie": cookie,
      ...quotaHeaders(quota),
    },
  });
}

export async function POST(request: Request) {
  const ipHash = hashIp(clientIp(request));
  if (!isAllowedOrigin(request.headers.get("origin"))) {
    logUsage({ ipHash, error: "origin" });
    return new Response(CHAT_COPY.forbidden, { status: 403 });
  }

  const raw = await request.text();
  if (raw.length > 20_000) {
    return new Response(CHAT_COPY.tooLong, { status: 400 });
  }

  let body: { messages?: unknown; turnstileToken?: unknown };
  try {
    body = JSON.parse(raw) as { messages?: unknown; turnstileToken?: unknown };
  } catch {
    return new Response(CHAT_COPY.failed, { status: 400 });
  }

  let guarded;
  try {
    guarded = await guardChatRequest(request, body.messages);
  } catch (error) {
    logUsage({
      ipHash,
      error: error instanceof Error ? error.message : "guard-failed",
    });
    return new Response(CHAT_COPY.unavailable, { status: 503 });
  }

  if (!guarded.ok) {
    logUsage({ ipHash, error: `http-${guarded.status}` });
    return text(guarded.message, guarded.status, guarded.cookie, guarded.quota);
  }

  try {
    const human = await assertHuman(
      request,
      guarded.sessionId,
      body.turnstileToken,
      guarded.cookie,
    );
    if (human) {
      logUsage({ ipHash: guarded.ipHash, error: "turnstile" });
      return text(human.message, human.status, human.cookie);
    }

    const capped = await consumeSiteCap(guarded.cookie, guarded.quota);
    if (capped.blocked) {
      logUsage({ ipHash: guarded.ipHash, error: "daily-cap" });
      return text(capped.blocked.message, capped.blocked.status, capped.blocked.cookie, capped.quota);
    }

    const latest = guarded.messages.at(-1);
    if (latest?.role === "user" && visitorIsOutOfScope(latest.parts[0].text)) {
      logUsage({ ipHash: guarded.ipHash, error: "out-of-scope" });
      return cannedReply(CHAT_COPY.offTopic, guarded.cookie, capped.quota);
    }

    const result = streamText({
      model: createGroq({ apiKey: process.env.GROQ_API_KEY })("openai/gpt-oss-20b"),
      system: buildChatSystemPrompt(),
      messages: await convertToModelMessages(forModel(guarded.messages)),
      tools: { navigate },
      stopWhen: stepCountIs(2),
      maxOutputTokens: 400,
      maxRetries: 0,
      onEnd: ({ usage }) => {
        logUsage({
          ipHash: guarded.ipHash,
          inputTokens: usage.inputTokens,
          outputTokens: usage.outputTokens,
        });
      },
      onError: ({ error }) => {
        logUsage({
          ipHash: guarded.ipHash,
          error: error instanceof Error ? error.message : "stream-error",
        });
      },
    });

    return withCookie(result.toUIMessageStreamResponse(), guarded.cookie, capped.quota);
  } catch (error) {
    const status = APICallError.isInstance(error) ? error.statusCode : undefined;
    logUsage({
      ipHash: guarded.ipHash,
      error: error instanceof Error ? error.message : "chat-failed",
    });
    const message = status === 429 ? CHAT_COPY.visitorLimit : CHAT_COPY.failed;
    const http = status === 429 ? 429 : 502;
    return text(message, http, guarded.cookie);
  }
}
