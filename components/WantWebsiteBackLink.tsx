"use client";

import { TransitionLink } from "@/components/TransitionLink";
import { prepareProjectToHomeNavigation } from "@/lib/navigation-transition";

export function WantWebsiteBackLink() {
  return (
    <TransitionLink
      href="/"
      prepare={prepareProjectToHomeNavigation}
      className="inline-block min-h-[44px] py-2 font-sans text-sm text-[#9F956C] transition-colors hover:text-white active:text-white"
    >
      ← Back
    </TransitionLink>
  );
}
