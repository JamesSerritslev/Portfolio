"use client";

import { TransitionLink } from "@/components/TransitionLink";
import { WANT_WEBSITE_ROUTE } from "@/data/want-a-website";
import { prepareProjectToProjectNavigation } from "@/lib/navigation-transition";
import { projectInnerFixedButtonClassName } from "@/lib/project-inner-fixed-button";
import { cn } from "@/lib/utils";

type WantWebsiteLinkProps = {
  variant: "mobile" | "fixed";
};

export function WantWebsiteLink({ variant }: WantWebsiteLinkProps) {
  const isMobile = variant === "mobile";

  return (
    <TransitionLink
      href={WANT_WEBSITE_ROUTE}
      prepare={prepareProjectToProjectNavigation}
      className={
        isMobile
          ? cn(
              "inline-flex max-w-full min-h-8 min-w-0 items-center justify-self-end rounded-full border border-[#9F956C]/40 bg-surface-elevated/90 px-2 py-1 text-right font-sans text-[11px] leading-none text-[#9F956C] sm:px-2.5 sm:text-xs",
            )
          : projectInnerFixedButtonClassName(
              "want-website-fixed right-4 max-md:hidden md:right-10",
            )
      }
    >
      {isMobile ? "Want a site?" : "Want a Website?"}
    </TransitionLink>
  );
}
