"use client";

import { TransitionLink } from "@/components/TransitionLink";
import { WANT_WEBSITE_ROUTE } from "@/data/want-a-website";
import { prepareProjectToProjectNavigation } from "@/lib/navigation-transition";
import { projectInnerFixedButtonClassName } from "@/lib/project-inner-fixed-button";

export function WantWebsiteFixed() {
  return (
    <TransitionLink
      href={WANT_WEBSITE_ROUTE}
      prepare={prepareProjectToProjectNavigation}
      className={projectInnerFixedButtonClassName(
        "want-website-fixed right-4 md:right-10",
      )}
    >
      Want a Website?
    </TransitionLink>
  );
}
