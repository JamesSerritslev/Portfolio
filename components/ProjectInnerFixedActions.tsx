"use client";

import { BackToHomeLink } from "@/components/BackToHomeLink";
import { WantWebsiteLink } from "@/components/WantWebsiteLink";
import { WANT_WEBSITE_ROUTE } from "@/data/want-a-website";
import { usePathname } from "next/navigation";

export function ProjectInnerFixedActions() {
  const pathname = usePathname();
  const showWantWebsite = pathname !== WANT_WEBSITE_ROUTE;

  return (
    <>
      <BackToHomeLink variant="fixed" />
      {showWantWebsite ? <WantWebsiteLink variant="fixed" /> : null}
    </>
  );
}
