import { cn } from "@/lib/utils";

interface WantWebsiteCardSkeletonProps {
  className?: string;
}

/** Content-loading skeleton: header, hero (image + lines), three cards (image + lines). */
export function WantWebsiteCardSkeleton({ className }: WantWebsiteCardSkeletonProps) {
  return (
    <svg
      viewBox="0 0 247.6 186.4"
      preserveAspectRatio="none"
      className={cn("want-website-card-skeleton absolute inset-0 h-full w-full bg-transparent", className)}
      aria-hidden
    >
      {/* Header — logo, nav pills, CTA */}
      <circle className="want-website-skeleton__shape want-website-skeleton__shape--outlined" cx="18" cy="14" r="7" />
      <rect className="want-website-skeleton__shape" x="32" y="10" width="36" height="8" rx="4" />
      <rect className="want-website-skeleton__shape" x="88" y="11" width="24" height="6" rx="3" />
      <rect className="want-website-skeleton__shape" x="118" y="11" width="24" height="6" rx="3" />
      <rect className="want-website-skeleton__shape" x="148" y="11" width="24" height="6" rx="3" />
      <rect className="want-website-skeleton__shape" x="196" y="10" width="44" height="8" rx="4" />

      {/* Hero — image left, paragraph lines right */}
      <rect
        className="want-website-skeleton__shape want-website-skeleton__shape--outlined"
        x="6"
        y="28"
        width="88"
        height="52"
        rx="6"
      />
      <rect className="want-website-skeleton__shape" x="102" y="30" width="138" height="8" rx="4" />
      <rect className="want-website-skeleton__shape" x="102" y="44" width="120" height="6" rx="3" />
      <rect className="want-website-skeleton__shape" x="102" y="56" width="128" height="6" rx="3" />
      <rect className="want-website-skeleton__shape" x="102" y="68" width="110" height="6" rx="3" />
      <rect className="want-website-skeleton__shape" x="102" y="80" width="124" height="6" rx="3" />

      {/* Card row — image block + text lines each */}
      <rect
        className="want-website-skeleton__shape want-website-skeleton__shape--outlined"
        x="6"
        y="92"
        width="72"
        height="36"
        rx="5"
      />
      <rect className="want-website-skeleton__shape" x="6" y="134" width="56" height="6" rx="3" />
      <rect className="want-website-skeleton__shape" x="6" y="146" width="64" height="6" rx="3" />
      <rect className="want-website-skeleton__shape" x="6" y="158" width="44" height="6" rx="3" />
      <rect className="want-website-skeleton__shape" x="6" y="174" width="52" height="6" rx="3" />

      <rect
        className="want-website-skeleton__shape want-website-skeleton__shape--outlined"
        x="88"
        y="92"
        width="72"
        height="36"
        rx="5"
      />
      <rect className="want-website-skeleton__shape" x="88" y="134" width="48" height="6" rx="3" />
      <rect className="want-website-skeleton__shape" x="88" y="146" width="58" height="6" rx="3" />
      <rect className="want-website-skeleton__shape" x="88" y="158" width="62" height="6" rx="3" />
      <rect className="want-website-skeleton__shape" x="88" y="174" width="40" height="6" rx="3" />

      <rect
        className="want-website-skeleton__shape want-website-skeleton__shape--outlined"
        x="170"
        y="92"
        width="72"
        height="36"
        rx="5"
      />
      <rect className="want-website-skeleton__shape" x="170" y="134" width="54" height="6" rx="3" />
      <rect className="want-website-skeleton__shape" x="170" y="146" width="60" height="6" rx="3" />
      <rect className="want-website-skeleton__shape" x="170" y="158" width="46" height="6" rx="3" />
      <rect className="want-website-skeleton__shape" x="170" y="174" width="50" height="6" rx="3" />
    </svg>
  );
}
