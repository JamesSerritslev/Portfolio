"use client";

import { useEffect, useId, useRef, useState } from "react";

const CODEPEN_URL = "https://codepen.io/alvarotrigo/pen/ExzXYmK";

export function ResumeAnimationNote({
  onLayoutChange,
}: {
  onLayoutChange?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const frame = requestAnimationFrame(() => {
      onLayoutChange?.();
      panelRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    });

    return () => cancelAnimationFrame(frame);
  }, [open, onLayoutChange]);

  const toggle = () => {
    setOpen((current) => !current);
    requestAnimationFrame(() => onLayoutChange?.());
  };

  return (
    <div className="mt-10 sm:mt-12">
      <div className="flex justify-center">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls={titleId}
          className="font-sans text-sm text-text-muted transition-colors hover:text-foreground active:text-foreground"
        >
          Animation Details
        </button>
      </div>

      {open ? (
        <div
          ref={panelRef}
          id={titleId}
          className="mt-4 rounded-lg border border-gold-border bg-surface p-5 sm:p-6"
        >
          <h2 className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-gold">
            Animation Details
          </h2>

          <p className="mt-4 font-sans text-sm leading-relaxed text-text-muted">
            Line reveal based on{" "}
            <a
              href={CODEPEN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline-offset-2 transition-colors hover:text-foreground hover:underline"
            >
              Álvaro Trigo&apos;s CodePen
            </a>
            . Full-page version built with AI-assisted development.
          </p>
        </div>
      ) : null}
    </div>
  );
}
