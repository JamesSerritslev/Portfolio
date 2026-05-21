"use client";

import { forceResetHomeDocument, releaseHomeScrollLock } from "@/lib/home-scroll-lock";
import { initPageReloadDetection } from "@/lib/page-reload";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

export function HomeScrollGuard() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useLayoutEffect(() => {
    initPageReloadDetection();

    if (typeof window !== "undefined") {
      history.scrollRestoration = "manual";
    }

    if (pathname === "/") {
      forceResetHomeDocument();
    } else if (previousPathname.current === "/") {
      releaseHomeScrollLock();
    }

    previousPathname.current = pathname;
  }, [pathname]);

  return null;
}
