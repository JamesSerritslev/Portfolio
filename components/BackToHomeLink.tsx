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
              "inline-flex max-w-full min-h-8 min-w-0 items-center justify-self-start rounded-full border border-[#9F956C]/40 bg-surface-elevated/90 px-2 py-1 font-sans text-[11px] leading-none text-[#9F956C] sm:px-2.5 sm:text-xs",
            )
          : projectInnerFixedButtonClassName(
              "back-to-home-fixed left-4 max-md:hidden md:left-10",
            )
      }
    >
      {isMobile ? "← Home" : "← Back to home"}
    </TransitionLink>
  );
}
