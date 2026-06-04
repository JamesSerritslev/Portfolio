"use client";

import { ProjectInnerFixedActions } from "@/components/ProjectInnerFixedActions";
import { useProjectInnerSwipeToHome } from "@/lib/use-project-inner-swipe-to-home";
import type { ReactNode } from "react";

interface ProjectInnerPageChromeProps {
  children: ReactNode;
}

export function ProjectInnerPageChrome({ children }: ProjectInnerPageChromeProps) {
  useProjectInnerSwipeToHome();

  return (
    <>
      <ProjectInnerFixedActions />
      {children}
    </>
  );
}
