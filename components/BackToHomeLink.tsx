"use client";

import { TransitionLink } from "@/components/TransitionLink";
import { prepareProjectToHomeNavigation } from "@/lib/navigation-transition";
import { projectInnerFixedButtonClassName } from "@/lib/project-inner-fixed-button";
import { cn } from "@/lib/utils";

type BackToHomeLinkProps = {
  variant: "mobile" | "fixed";
};

export function BackToHomeLink({ variant }: BackToHomeLinkProps) {
  const isMobile = variant === "mobile";

  return (
    <TransitionLink
      href="/"
      prepare={prepareProjectToHomeNavigation}
      className={
        isMobile
          ? cn(
              "inline-flex min-h-8 items-center rounded-full border border-[#9F956C]/40 bg-black/60 px-2.5 py-1 font-sans text-xs text-[#9F956C]",
            )
          : projectInnerFixedButtonClassName(
              "back-to-home-fixed left-4 max-md:hidden md:left-10",
            )
      }
    >
      ← Back to home
    </TransitionLink>
  );
}
