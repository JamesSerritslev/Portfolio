"use client";

import { BackToHomeLink } from "@/components/BackToHomeLink";
import { WantWebsiteLink } from "@/components/WantWebsiteLink";
import { WANT_WEBSITE_ROUTE } from "@/data/want-a-website";
import { usePathname } from "next/navigation";

/** In-flow top actions on inner pages (mobile only). */
export function ProjectInnerMobileTopBar() {
  const pathname = usePathname();
  const showWantWebsite = pathname !== WANT_WEBSITE_ROUTE;

  return (
    <div className="mb-3 grid w-full min-w-0 max-w-full grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-2 overflow-x-clip pt-[env(safe-area-inset-top,0px)] md:hidden">
      <BackToHomeLink variant="mobile" />
      {showWantWebsite ? <WantWebsiteLink variant="mobile" /> : null}
    </div>
  );
}
