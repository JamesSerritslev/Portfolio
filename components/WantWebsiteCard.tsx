"use client";

import { PROJECT_IMAGE } from "@/data/projects";
import { WantWebsiteCardSkeleton } from "@/components/WantWebsiteCardSkeleton";
import {
  WANT_WEBSITE_CARD,
  WANT_WEBSITE_ROUTE,
} from "@/data/want-a-website";
import { prepareHomeToProjectNavigation, scheduleTransitionNavigation } from "@/lib/navigation-transition";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const { height: imgH, width: imgW } = PROJECT_IMAGE;
const IMAGE_ASPECT_PADDING = `calc(100% * ${imgH} / ${imgW})`;

const cardHoverStyles =
  "border-2 border-[#9F956C]/25 transition-all duration-300 hover:border-[#9F956C] hover:shadow-[0_0_0_1px_#9F956C,0_12px_32px_rgba(159,149,108,0.2)]";

interface WantWebsiteCardProps {
  layoutClassName?: string;
  isElevated?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function WantWebsiteCard({
  layoutClassName,
  isElevated = false,
  onMouseEnter,
  onMouseLeave,
}: WantWebsiteCardProps) {
  const router = useRouter();

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      scheduleTransitionNavigation(
        WANT_WEBSITE_ROUTE,
        prepareHomeToProjectNavigation,
        (target) => {
          router.push(target, { scroll: false });
        },
      );
    },
    [router],
  );

  return (
    <Link
      href={WANT_WEBSITE_ROUTE}
      scroll={false}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "group pointer-events-auto mx-auto block w-full max-w-[22rem] overflow-hidden rounded-2xl bg-surface-elevated p-1 shadow-[0_4px_24px_rgba(0,0,0,0.45)] md:mx-0 md:w-[17rem] md:max-w-none lg:w-[19rem] xl:w-[21rem]",
        cardHoverStyles,
        "hover:scale-[1.02] active:scale-[0.99] md:active:scale-100",
        isElevated && "!z-50",
        layoutClassName,
      )}
    >
      <div className="relative w-full overflow-hidden rounded-xl bg-surface">
        <div
          className="relative w-full overflow-hidden"
          style={{ paddingBottom: IMAGE_ASPECT_PADDING }}
        >
          <WantWebsiteCardSkeleton />
        </div>
      </div>
      <div className="space-y-1 px-1.5 pb-1.5 pt-1.5">
        <p className="font-sans text-[10px] tracking-wide text-[#9F956C] md:text-xs">
          Custom development
        </p>
        <h2 className="font-serif text-lg text-foreground transition-colors duration-300 group-hover:text-[#9F956C] md:text-xl">
          {WANT_WEBSITE_CARD.title}
        </h2>
        <p className="line-clamp-2 font-sans text-[11px] leading-relaxed text-text-muted md:text-xs">
          {WANT_WEBSITE_CARD.shortDescription}
        </p>
      </div>
    </Link>
  );
}
