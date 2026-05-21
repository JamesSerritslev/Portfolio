"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { scheduleTransitionNavigation } from "@/lib/navigation-transition";

interface TransitionLinkProps {
  href: string;
  prepare: () => void;
  className?: string;
  children: React.ReactNode;
}

export function TransitionLink({
  href,
  prepare,
  className,
  children,
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
    <Link href={href} scroll={false} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
