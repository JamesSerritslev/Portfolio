export const CHAT_PATHS = [
  "/projects/bandscope",
  "/projects/analogue-room",
  "/projects/standing-sun-wines",
  "/projects/projects-app",
  "/resume",
] as const;

export type ChatPath = (typeof CHAT_PATHS)[number];

export function isChatPath(value: unknown): value is ChatPath {
  return typeof value === "string" && (CHAT_PATHS as readonly string[]).includes(value);
}
