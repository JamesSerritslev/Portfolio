import { BackToHomeLink } from "@/components/BackToHomeLink";

/** In-flow back control at the top of inner page content (mobile only). */
export function BackToHomeMobileBar() {
  return (
    <div className="mb-3 pt-[env(safe-area-inset-top,0px)] md:hidden">
      <BackToHomeLink variant="mobile" />
    </div>
  );
}
