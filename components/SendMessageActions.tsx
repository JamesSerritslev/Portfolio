"use client";

import { SendMessageButton, type SendMessageButtonState } from "@/components/SendMessageButton";
import {
  SendMessageOverlay,
  type SendMessageOverlayPhase,
} from "@/components/SendMessageOverlay";

interface SendMessageActionsProps {
  state: SendMessageButtonState;
  overlayPhase?: SendMessageOverlayPhase;
  onDismissThanks?: () => void;
}

export function SendMessageActions({
  state,
  overlayPhase = "closed",
  onDismissThanks,
}: SendMessageActionsProps) {
  return (
    <>
      <SendMessageOverlay
        phase={overlayPhase}
        onDismissThanks={onDismissThanks}
      />
      <div className="send-message-actions">
        <SendMessageButton state={state} />
      </div>
    </>
  );
}
