"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { scheduleTransitionNavigation } from "@/lib/navigation-transition";
import type { ComponentProps } from "react";

type TransitionLinkProps = {
  href: string;
  prepare: () => void;
} & Omit<ComponentProps<typeof Link>, "href" | "onClick">;

export function TransitionLink({
  href,
  prepare,
  className,
  children,
  ...linkProps
}: TransitionLinkProps) {
  const router = useRouter();

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      scheduleTransitionNavigation(href, prepare, (target) => {
        router.push(target, { scroll: false });
      });
    },
    [href, prepare, router],
  );

  return (
    <Link
      href={href}
      scroll={false}
      onClick={handleClick}
      className={className}
      {...linkProps}
    >
      {children}
    </Link>
  );
}
