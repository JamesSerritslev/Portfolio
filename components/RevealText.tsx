"use client";

import { cn } from "@/lib/utils";
import type { CSSProperties, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

function syncRevealOffset(element: HTMLElement) {
  element.style.setProperty(
    "--reveal-left",
    `${-element.getBoundingClientRect().left}px`,
  );
}

interface RevealLineProps {
  animate: boolean;
  revealReady?: boolean;
  delay?: number;
  className?: string;
  children: ReactNode;
}

export function RevealLine({
  animate,
  revealReady = true,
  delay = 0,
  className,
  children,
}: RevealLineProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);

  const updateOffset = useCallback(() => {
    if (ref.current) syncRevealOffset(ref.current);
  }, []);

  useEffect(() => {
    if (!animate || !revealReady) return;

    const element = ref.current;
    if (!element) return;

    updateOffset();
    window.addEventListener("resize", updateOffset);
    window.addEventListener("scroll", updateOffset, { passive: true });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          updateOffset();
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateOffset);
      window.removeEventListener("scroll", updateOffset);
    };
  }, [animate, revealReady, updateOffset]);

  if (!animate) {
    return (
      <span className={cn("block leading-[1.3]", className)}>{children}</span>
    );
  }

  if (!revealReady) {
    return (
      <span className={cn("invisible block leading-[1.3]", className)}>
        {children}
      </span>
    );
  }

  return (
    <span
      ref={ref}
      className={cn("reveal-line", active && "reveal-line-active", className)}
      style={{ "--delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </span>
  );
}

interface RevealTextProps {
  lines: string[];
  className?: string;
  lineClassName?: string;
  baseDelay?: number;
  stagger?: number;
  animate?: boolean;
  revealReady?: boolean;
}

export function RevealText({
  lines,
  className,
  lineClassName,
  baseDelay = 0.08,
  stagger = 0.08,
  animate = true,
  revealReady = true,
}: RevealTextProps) {
  return (
    <div className={className}>
      {lines.map((line, index) => (
        <RevealLine
          key={`${index}-${line}`}
          animate={animate}
          revealReady={revealReady}
          delay={baseDelay + index * stagger}
          className={lineClassName}
        >
          {line}
        </RevealLine>
      ))}
    </div>
  );
}
