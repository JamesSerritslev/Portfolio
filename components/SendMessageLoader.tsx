interface SendMessageLoaderProps {
  size?: "overlay";
}

function LoaderGraphic() {
  return (
    <>
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
    </>
  );
}

export function SendMessageLoader({ size }: SendMessageLoaderProps) {
  if (size === "overlay") {
    return (
      <span className="send-message-loader__overlay-stage" aria-hidden>
        <span className="send-message-loader send-message-loader--overlay">
          <LoaderGraphic />
        </span>
      </span>
    );
  }

  return (
    <span className="send-message-loader" aria-hidden>
      <LoaderGraphic />
    </span>
  );
}
