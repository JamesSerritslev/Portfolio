import { cn } from "@/lib/utils";

interface SendMessageLoaderProps {
  size?: "overlay";
}

export function SendMessageLoader({ size }: SendMessageLoaderProps) {
  return (
    <span
      className={cn(
        "send-message-loader",
        size === "overlay" && "send-message-loader--overlay",
      )}
      aria-hidden
    >
      <span className="send-message-loader__longfazers">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className="send-message-loader__car">
        <span>
          <span />
          <span />
          <span />
          <span />
        </span>
        <span className="send-message-loader__base">
          <span />
        </span>
        <span className="send-message-loader__face" />
      </span>
    </span>
  );
}
